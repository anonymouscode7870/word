import sys
import os
import io

# Fix Windows console encoding for DeepFace emoji output
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

import traceback
import re
import time
from flask import Flask, render_template, Response, request, jsonify
import base64
import cv2
import face_recognition
import numpy as np
import os
import sqlite3
import pymongo
from pymongo import ReturnDocument
from datetime import datetime
from pathlib import Path
from deepface import DeepFace
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# SETUP DATABASE
MONGO_URI = os.environ.get("MONGO_URI")
DB_FILE = "attendance.db"
use_mongodb = False

try:
    # Check if a password is required but missing to avoid config error (Atlas URIs require a password if username is provided)
    # If the MONGO_URI lacks a password field, pymongo MongoClient instantiation will fail immediately with ConfigurationError.
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    # Check connection
    client.server_info()
    db = client["attendance_system"]
    logs_collection = db["attendance_logs"]
    counters_collection = db["counters"]
    use_mongodb = True
    print("Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}. Falling back to local SQLite database.")
    client = None
    db = None
    logs_collection = None
    counters_collection = None

def init_db():
    """Creates the SQLite database and table if they don't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            emotion TEXT DEFAULT '',
            gender TEXT DEFAULT '',
            timestamp REAL DEFAULT 0.0
        )
    ''')
    # Migration: add new columns if they don't exist (for existing DBs)
    for col_name, col_def in [("emotion", "TEXT DEFAULT ''"), ("gender", "TEXT DEFAULT ''"), ("timestamp", "REAL DEFAULT 0.0")]:
        try:
            cursor.execute(f"ALTER TABLE attendance_logs ADD COLUMN {col_name} {col_def}")
        except sqlite3.OperationalError:
            pass
    conn.commit()
    conn.close()

def get_next_sequence_value(sequence_name):
    """Generates an auto-incrementing integer sequence ID like in relational databases."""
    try:
        if counters_collection is not None:
            counter = counters_collection.find_one_and_update(
                {"_id": sequence_name},
                {"$inc": {"sequence_value": 1}},
                upsert=True,
                return_document=ReturnDocument.AFTER
            )
            return counter["sequence_value"]
    except Exception as e:
        print(f"Error generating sequence value: {e}")
    return int(time.time())

def parse_date_time_to_timestamp(date_str, time_str):
    """Parses date and time strings into a Unix timestamp."""
    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %I:%M %p")
        return dt.timestamp()
    except Exception:
        try:
            for fmt in ("%H:%M:%S", "%H:%M", "%I:%M:%S %p"):
                try:
                    dt = datetime.strptime(f"{date_str} {time_str}", f"%Y-%m-%d {fmt}")
                    return dt.timestamp()
                except ValueError:
                    continue
        except Exception:
            pass
    return 0.0

def has_logged_recently(name):
    """Checks if the person has logged attendance in the last 24 hours."""
    cutoff_timestamp = time.time() - 86400  # 24 hours in seconds
    
    if use_mongodb:
        try:
            record = logs_collection.find_one({
                "name": name,
                "timestamp": {"$gt": cutoff_timestamp}
            })
            if record:
                return True
        except Exception as e:
            print(f"Error checking MongoDB logs: {e}")
            
    try:
        if os.path.exists(DB_FILE):
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(attendance_logs)")
            columns = [col[1] for col in cursor.fetchall()]
            
            if "timestamp" in columns:
                cursor.execute('''
                    SELECT 1 FROM attendance_logs 
                    WHERE name = ? AND timestamp > ? 
                    LIMIT 1
                ''', (name, cutoff_timestamp))
                if cursor.fetchone():
                    conn.close()
                    return True
            else:
                current_date = datetime.now().strftime("%Y-%m-%d")
                cursor.execute('''
                    SELECT 1 FROM attendance_logs 
                    WHERE name = ? AND date = ? 
                    LIMIT 1
                ''', (name, current_date))
                if cursor.fetchone():
                    conn.close()
                    return True
            conn.close()
    except Exception as sqle:
        print(f"Error checking SQLite logs: {sqle}")
        
    return False

def migrate_sqlite_to_mongodb():
    """Migrates legacy SQLite records to MongoDB Atlas if SQLite database exists."""
    if os.path.exists(DB_FILE):
        print("Found legacy SQLite database. Checking for migration to MongoDB...")
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='attendance_logs'")
            if cursor.fetchone():
                cursor.execute("PRAGMA table_info(attendance_logs)")
                columns = [col[1] for col in cursor.fetchall()]
                
                if "timestamp" in columns:
                    cursor.execute("SELECT id, name, date, time, emotion, gender, timestamp FROM attendance_logs ORDER BY id ASC")
                    records = cursor.fetchall()
                else:
                    cursor.execute("SELECT id, name, date, time, emotion, gender FROM attendance_logs ORDER BY id ASC")
                    records = [row + (0.0,) for row in cursor.fetchall()]

                if records:
                    print(f"Migrating {len(records)} records from SQLite to MongoDB...")
                    max_id = 0
                    for row in records:
                        if len(row) == 7:
                            rec_id, name, date, time_str, emotion, gender, timestamp = row
                        else:
                            rec_id, name, date, time_str, emotion, gender = row[:6]
                            timestamp = 0.0
                        
                        if timestamp == 0.0:
                            timestamp = parse_date_time_to_timestamp(date, time_str)

                        if logs_collection is not None and not logs_collection.find_one({"id": rec_id}):
                            logs_collection.insert_one({
                                "id": rec_id,
                                "name": name,
                                "date": date,
                                "time": time_str,
                                "emotion": emotion or "",
                                "gender": gender or "",
                                "timestamp": timestamp
                            })
                        if rec_id > max_id:
                            max_id = rec_id
                    
                    if max_id > 0 and counters_collection is not None:
                        counters_collection.update_one(
                            {"_id": "log_id"},
                            {"$set": {"sequence_value": max_id}},
                            upsert=True
                        )
                    print("Migration completed successfully!")
            conn.close()
            backup_file = "attendance.db.backup"
            if os.path.exists(backup_file):
                backup_file = f"attendance.db.backup_{int(time.time())}"
            os.rename(DB_FILE, backup_file)
            print(f"Renamed legacy SQLite database to {backup_file}")
        except Exception as e:
            print(f"Error during SQLite to MongoDB migration: {e}")

# Run migration immediately on startup if MongoDB is connected, otherwise initialize SQLite
if use_mongodb:
    migrate_sqlite_to_mongodb()
else:
    init_db()


# LOAD DATA ON STARTUP
DATASET_DIR = Path("dataset_extracted")
DATASET_DIR.mkdir(exist_ok=True)

known_encodings = []
known_names = []

print("Loading dataset and encoding faces. Please wait...")
for person_name in os.listdir(DATASET_DIR):
    person_path = DATASET_DIR / person_name
    if not person_path.is_dir():
        continue

    for image_name in os.listdir(person_path):
        image_path = person_path / image_name
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        if len(encodings) > 0:
            known_encodings.append(encodings[0])
            known_names.append(person_name.replace('_', ' '))

print(f"Loaded {len(known_encodings)} faces. Starting app...")


# DEEPFACE ANALYSIS CACHE
# Stores { name: { "emotion": str, "age": int, "gender": str, "race": str, "timestamp": float } }
analysis_cache = {}
CACHE_TTL = 10  # seconds before re-analyzing a known person
UNKNOWN_CACHE_TTL = 5  # seconds for unknown faces


def get_cached_analysis(name):
    """Return cached analysis if still fresh or if we have reached the 5-frame limit."""
    if name in analysis_cache:
        entry = analysis_cache[name]
        
        # OPTIMIZATION: If we have analyzed this face 5 times, stop analyzing and use cache forever
        if entry.get("count", 0) >= 5:
            return entry

        ttl = UNKNOWN_CACHE_TTL if name == "Unknown" else CACHE_TTL
        if time.time() - entry["timestamp"] < ttl:
            return entry
    return None


from concurrent.futures import ThreadPoolExecutor

# Initialize thread pool for parallel analysis
executor = ThreadPoolExecutor(max_workers=4)

def run_deepface_analysis(face_img):
    """
    Run DeepFace.analyze on a cropped face image.
    Uses detector_backend='skip' for massive speedup since we already have the crop.
    """
    try:
        # Pre-resize to 224x224 (typical for DeepFace models) to reduce processing overhead
        if face_img.shape[0] > 224 or face_img.shape[1] > 224:
            face_img = cv2.resize(face_img, (224, 224))

        results = DeepFace.analyze(
            face_img,
            actions=['emotion', 'gender'],
            enforce_detection=False,
            detector_backend='skip', # Crucial: skip redundant detection
            silent=True
        )
        # DeepFace returns a list; take the first result
        result = results[0] if isinstance(results, list) else results

        return {
            "emotion": result.get("dominant_emotion", "N/A"),
            "gender": result.get("dominant_gender", "N/A"),
            "timestamp": time.time()
        }
    except Exception as e:
        # Don't print full traceback for every failure to keep logs clean on low-end systems
        # print(f"DeepFace analysis error: {e}")
        return None

def warm_up_deepface():
    """Pre-loads DeepFace models to avoid lag on first detection."""
    print("Pre-warming DeepFace models...")
    try:
        dummy_img = np.zeros((224, 224, 3), dtype=np.uint8)
        DeepFace.analyze(dummy_img, actions=['emotion', 'gender'], 
                         enforce_detection=False, detector_backend='skip', silent=True)
        print("DeepFace models loaded successfully.")
    except Exception as e:
        print(f"DeepFace warming failed: {e}")

# Run warming in background
import threading
threading.Thread(target=warm_up_deepface, daemon=True).start()


# LOGGING LOGIC
marked_names = set()

def mark_attendance(name, analysis_data=None):
    if has_logged_recently(name):
        print(f"Attendance already recorded in the last 24 hours for: {name}")
        return False

    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%I:%M %p")  # 12-hour format (e.g., 01:45 PM)
    current_timestamp = now.timestamp()

    emotion = ""
    gender = ""
    if analysis_data:
        emotion = analysis_data.get("emotion", "")
        gender = analysis_data.get("gender", "")

    if use_mongodb:
        try:
            log_id = get_next_sequence_value("log_id")
            logs_collection.insert_one({
                "id": log_id,
                "name": name,
                "date": current_date,
                "time": current_time,
                "emotion": emotion,
                "gender": gender,
                "timestamp": current_timestamp
            })
            print(f"Attendance Logged in MongoDB for: {name} "
                  f"[id={log_id}, emotion={emotion}, gender={gender}]")
            return True
        except Exception as e:
            print(f"Error logging attendance to MongoDB: {e}. Falling back to SQLite.")

    # SQLite fallback
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO attendance_logs (name, date, time, emotion, gender, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, current_date, current_time, emotion, gender, current_timestamp))
        conn.commit()
        conn.close()
        print(f"Attendance Logged in SQLite Database for: {name} "
              f"[emotion={emotion}, gender={gender}]")
        return True
    except Exception as sqle:
        print(f"Error logging attendance to SQLite: {sqle}")
        
    return False


# EMOJI MAPPINGS
EMOTION_EMOJIS = {
    "happy": "😊", "sad": "😢", "angry": "😠", "surprise": "😲",
    "fear": "😨", "disgust": "🤢", "neutral": "😐"
}


# WEBCAM FRAME PROCESSING (Cloud-compatible)
@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        data = request.json['image']

        header, encoded = data.split(",", 1)
        img_data = base64.b64decode(encoded)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        faces_analysis = []  # analysis data to send to frontend

        for face_encoding, face_location in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)

            name = "Unknown"
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_names[best_match_index]

            # Scale face location back to full resolution
            top, right, bottom, left = face_location
            top, right, bottom, left = top * 4, right * 4, bottom * 4, left * 4

            # Crop face from full frame for DeepFace analysis
            # Add padding for better analysis accuracy
            h, w = frame.shape[:2]
            pad = 30
            crop_top = max(0, top - pad)
            crop_bottom = min(h, bottom + pad)
            crop_left = max(0, left - pad)
            crop_right = min(w, right + pad)
            face_crop = frame[crop_top:crop_bottom, crop_left:crop_right]

            # Build task list for analysis
            analysis_tasks = []
            
            # Check cache or run analysis
            cache_key = name if name != "Unknown" else f"Unknown_{left}_{top}"
            analysis = get_cached_analysis(cache_key)

            # Optimization: only run analysis if face is large enough (>70px)
            if analysis is None and face_crop.size > 0 and (bottom - top) >= 70:
                analysis = run_deepface_analysis(face_crop)
                if analysis:
                    # Track how many times we've analyzed this specific face/person
                    prev_entry = analysis_cache.get(cache_key, {})
                    analysis["count"] = prev_entry.get("count", 0) + 1
                    analysis_cache[cache_key] = analysis

            # Mark attendance with analysis data
            attendance_status = "none"
            if name != "Unknown":
                marked_now = mark_attendance(name, analysis)
                if marked_now:
                    attendance_status = "marked"
                else:
                    attendance_status = "already_marked"

            # ── Draw on frame ──

            # Face rectangle
            color = (0, 255, 0) if name != "Unknown" else (0, 140, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

            # Semi-transparent label background
            label_text = name
            if analysis:
                emoji_char = EMOTION_EMOJIS.get(analysis.get("emotion", "").lower(), "")
                label_text = f"{name}"

            # Name label (above box)
            (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
            cv2.rectangle(frame, (left, top - th - 14), (left + tw + 10, top), color, -1)
            cv2.putText(frame, label_text, (left + 5, top - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            face_data = {
                "name": name,
                "box": {"top": top, "right": right, "bottom": bottom, "left": left},
                "attendance": attendance_status
            }
            if analysis:
                face_data["analysis"] = {
                    "emotion": analysis.get("emotion", "N/A"),
                    "gender": analysis.get("gender", "N/A")
                }
            faces_analysis.append(face_data)

        _, buffer = cv2.imencode('.jpg', frame)
        out_b64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'image': f"data:image/jpeg;base64,{out_b64}",
            'faces': faces_analysis
        })

    except Exception as e:
        traceback.print_exc()
        print(f"Error processing frame: {e}")
        return jsonify({'error': str(e)}), 500



#  NEW: USER REGISTRATION ROUTE
@app.route('/register', methods=['POST'])
def register():
    """
    Accepts a name and an array of base64-encoded face images (minimum 5).
    Saves all valid images to dataset_extracted/<name>/ and hot-reloads
    every face encoding into memory — no server restart required.
    """
    MIN_PHOTOS = 5
    MAX_PHOTOS = 10

    try:
        payload     = request.json
        name        = payload.get('name', '').strip()
        images_data = payload.get('images', [])   # list of base64 data URLs

        # Validate name
        if not name:
            return jsonify({'success': False, 'error': 'Name cannot be empty.'}), 400

        if not re.match(r'^[\w\s\-]+$', name):
            return jsonify({'success': False,
                            'error': 'Name contains invalid characters. '
                                     'Use letters, numbers, spaces or hyphens.'}), 400

        # Validate photo count
        if not isinstance(images_data, list) or len(images_data) < MIN_PHOTOS:
            return jsonify({'success': False,
                            'error': f'Please provide at least {MIN_PHOTOS} photos '
                                     f'for accurate recognition. '
                                     f'You sent {len(images_data)}.'}), 400

        # Cap at MAX_PHOTOS (browser should enforce this too, but be safe)
        images_data = images_data[:MAX_PHOTOS]

        # Process each image
        # We keep underscores for folder names for compatibility, 
        # but will use the original name for display/logging.
        folder_name = name.replace(' ', '_')
        person_dir  = DATASET_DIR / folder_name
        person_dir.mkdir(parents=True, exist_ok=True)

        new_encodings   = []   # encodings successfully extracted from this batch
        saved_count     = 0
        no_face_count   = 0
        multi_face_count = 0

        for idx, image_data in enumerate(images_data):
            if ',' not in image_data:
                continue

            try:
                _, encoded = image_data.split(',', 1)
                img_bytes  = base64.b64decode(encoded)
                nparr      = np.frombuffer(img_bytes, np.uint8)
                frame      = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                continue

            if frame is None:
                continue

            rgb_frame      = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)

            if len(face_locations) == 0:
                no_face_count += 1
                continue
            if len(face_locations) > 1:
                multi_face_count += 1
                continue

            encoding = face_recognition.face_encodings(rgb_frame, face_locations)[0]
            new_encodings.append(encoding)

            # Save image
            timestamp  = datetime.now().strftime("%Y%m%d_%H%M%S%f")
            image_path = person_dir / f"photo_{idx:02d}_{timestamp}.jpg"
            cv2.imwrite(str(image_path), frame)
            saved_count += 1

        # Require at least MIN_PHOTOS usable face photos
        if saved_count < MIN_PHOTOS:
            # Clean up any partially-saved files
            import shutil
            if person_dir.exists() and not any(person_dir.iterdir()):
                shutil.rmtree(person_dir)

            reasons = []
            if no_face_count:
                reasons.append(f"{no_face_count} photo(s) had no detectable face")
            if multi_face_count:
                reasons.append(f"{multi_face_count} photo(s) had multiple faces")

            detail = ('. ' + '; '.join(reasons) + '.') if reasons else '.'
            return jsonify({
                'success': False,
                'error':   f'Only {saved_count} usable face photos out of '
                           f'{len(images_data)} provided{detail} '
                           f'Please retake with better lighting and only your face in frame.'
            }), 400

        # Duplicate check (compare first new encoding against known set)
        if len(known_encodings) > 0:
            distances = face_recognition.face_distance(known_encodings, new_encodings[0])
            best_idx  = np.argmin(distances)
            if distances[best_idx] < 0.5:
                existing = known_names[best_idx]
                # Remove newly saved folder since it's a duplicate
                import shutil
                shutil.rmtree(person_dir, ignore_errors=True)
                return jsonify({
                    'success': False,
                    'error':   f'This face is already registered as "{existing}".'
                }), 409

        # Hot-reload all new encodings into memory
        for enc in new_encodings:
            known_encodings.append(enc)
            known_names.append(name)

        print(f"[REGISTER] '{name}' registered with {saved_count} photos. "
              f"Total known face encodings: {len(known_encodings)}")

        return jsonify({
            'success': True,
            'message': f'"{name}" registered successfully with {saved_count} photos! '
                       f'Attendance will now be marked automatically.'
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500


# ROUTES
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/logs')
def view_logs():
    records = []
    if use_mongodb:
        try:
            # Retrieve all logs from MongoDB sorted by id in descending order
            records_cursor = logs_collection.find().sort("id", -1)
            for doc in records_cursor:
                records.append((
                    doc.get("id", 0),
                    doc.get("name", "N/A"),
                    doc.get("date", "N/A"),
                    doc.get("time", "N/A"),
                    doc.get("emotion", ""),
                    doc.get("gender", "")
                ))
        except Exception as e:
            print(f"Error fetching logs from MongoDB: {e}. Trying SQLite fallback.")
            records = []
            
    if not records:
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, date, time, emotion, gender FROM attendance_logs ORDER BY id DESC")
            records = cursor.fetchall()
            conn.close()
        except Exception as sqle:
            print(f"Error fetching logs from SQLite: {sqle}")
            records = []

    # Format time to AM/PM for display (handles old 24h records too)
    formatted_records = []
    for row in records:
        row_list = list(row)
        time_str = row_list[3]
        try:
            # Try to parse and reformat if it looks like 24h time or has seconds
            for fmt in ("%H:%M:%S", "%H:%M", "%I:%M:%S %p"):
                try:
                    t = datetime.strptime(time_str, fmt)
                    row_list[3] = t.strftime("%I:%M %p")
                    break
                except ValueError:
                    continue
        except Exception:
            pass
        formatted_records.append(tuple(row_list))

    return render_template('logs.html', records=formatted_records)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)