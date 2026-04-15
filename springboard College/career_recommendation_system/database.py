# ============================================================
# database.py
# SQLite Database Configuration & User Management
# ============================================================

import sqlite3
import hashlib


# ------------------------------------------------------------
# Create Database Connection
# ------------------------------------------------------------
def connect_db():
    conn = sqlite3.connect("career_app.db", check_same_thread=False)
    return conn


# ------------------------------------------------------------
# Create Users Table
# ------------------------------------------------------------
def create_users_table():
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# ------------------------------------------------------------
# Password Hashing
# ------------------------------------------------------------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# ------------------------------------------------------------
# Insert New User
# ------------------------------------------------------------
def add_user(email, password):
    conn = connect_db()
    cursor = conn.cursor()

    hashed_password = hash_password(password)

    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hashed_password)
        )
        conn.commit()
        return True
    except:
        return False
    finally:
        conn.close()


# ------------------------------------------------------------
# Verify Login
# ------------------------------------------------------------
def verify_user(email, password):
    conn = connect_db()
    cursor = conn.cursor()

    hashed_password = hash_password(password)

    cursor.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (email, hashed_password)
    )

    user = cursor.fetchone()
    conn.close()

    return user is not None