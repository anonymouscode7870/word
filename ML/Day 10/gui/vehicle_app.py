import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import numpy as np
import joblib
from scipy.stats import kurtosis
import warnings
import traceback
import threading
import time
import os

warnings.filterwarnings("ignore")

# ─────────────────────────────────────────
# Color Palette
# ─────────────────────────────────────────
BG          = "#0a0f1a"
SURFACE     = "#111827"
SURFACE2    = "#1a2235"
BORDER      = "#1e3050"
ACCENT      = "#00b4d8"
ACCENT2     = "#00f5a0"
DANGER      = "#ff4d6d"
TEXT        = "#c8ddf0"
MUTED       = "#4a6880"
WHITE       = "#ffffff"
TANK_COLOR  = "#00f5a0"
NON_COLOR   = "#00b4d8"

# ─────────────────────────────────────────
# Load Model
# ─────────────────────────────────────────
# try:
#     model = joblib.load("final_tank_vs_truck_model.pkl")
# except Exception as e:
#     import sys
#     root_err = tk.Tk()
#     root_err.withdraw()
#     messagebox.showerror("Model Load Error", f"Could not load model:\n{e}")
#     sys.exit(1)

def resource_path(relative_path):
    """
    Get absolute path to resource, works for PyInstaller
    """
    try:
        base_path = sys._MEIPASS  # PyInstaller temp folder
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

model = joblib.load(resource_path("final_tank_vs_truck_model.pkl"))

# ─────────────────────────────────────────
# File Reader
# ─────────────────────────────────────────
def read_vehicle_file(file_path):
    data = []
    with open(file_path, "r", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) < 3:
                continue
            try:
                data.append([float(parts[0]), float(parts[1]), float(parts[2])])
            except ValueError:
                continue
    if len(data) == 0:
        return np.empty((0, 3), dtype=np.float64)
    return np.array(data, dtype=np.float64)

# ─────────────────────────────────────────
# Feature Extraction
# ─────────────────────────────────────────
def extract_features(signal):
    features = []
    for col in range(3):
        data = signal[:, col]
        mean       = np.mean(data)
        std        = np.std(data)
        rms        = np.sqrt(np.mean(data ** 2))
        energy     = np.mean(data ** 2)
        peak       = np.max(np.abs(data))
        peak2rms   = peak / (rms + 1e-8)
        kurt       = kurtosis(data)
        features.extend([mean, std, rms, energy, peak2rms, kurt])
    seismic = signal[:, 0]
    zcr = np.mean(np.diff(np.sign(seismic)) != 0)
    features.append(zcr)
    return np.array(features).reshape(1, -1)

# ─────────────────────────────────────────
# Custom Widgets
# ─────────────────────────────────────────
class AnimatedBar(tk.Canvas):
    """Animated confidence progress bar."""
    def __init__(self, parent, **kwargs):
        kwargs.setdefault('bg', SURFACE2)
        super().__init__(parent, height=6,
                         highlightthickness=0, bd=0, **kwargs)
        self._fill = self.create_rectangle(0, 0, 0, 6, fill=ACCENT, outline="")
        self._target = 0
        self._current = 0

    def set_color(self, color):
        self.itemconfig(self._fill, fill=color)

    def animate_to(self, pct):
        self._target = pct
        self._current = 0
        self._step()

    def _step(self):
        if self._current < self._target:
            self._current = min(self._current + 2, self._target)
            w = self.winfo_width()
            x2 = int(w * self._current / 100)
            self.coords(self._fill, 0, 0, x2, 6)
            self.after(12, self._step)


class SeparatorLine(tk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, height=1, bg=BORDER, **kwargs)


class StatusDot(tk.Canvas):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, width=10, height=10,
                         bg=BG, highlightthickness=0, **kwargs)
        self._dot = self.create_oval(2, 2, 9, 9, fill=MUTED, outline="")
        self._pulsing = False

    def set_state(self, state):
        self._pulsing = False
        color = {
            "ready":      MUTED,
            "processing": "#ffa500",
            "ok":         ACCENT2,
            "error":      DANGER,
        }.get(state, MUTED)
        self.itemconfig(self._dot, fill=color)
        if state in ("processing", "ok"):
            self._pulsing = True
            self._pulse(True)

    def _pulse(self, growing):
        if not self._pulsing:
            return
        r = 5 if growing else 3
        pad = (6 - r) // 2
        self.coords(self._dot, pad, pad, 10 - pad, 10 - pad)
        self.after(400, self._pulse, not growing)


# ─────────────────────────────────────────
# Main Application
# ─────────────────────────────────────────
class VehicleClassifierApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Vehicle Classification System")
        self.geometry("540x680")
        self.resizable(True, True)
        self.configure(bg=BG)

        self._file_path = None
        self._build_ui()

    # ── UI Construction ────────────────────
    def _build_ui(self):
        # ── Header ──────────────────────────
        hdr = tk.Frame(self, bg=BG)
        hdr.pack(fill="x", padx=28, pady=(28, 0))

        badge_row = tk.Frame(hdr, bg=BG)
        badge_row.pack(anchor="w")
        tk.Canvas(badge_row, width=8, height=8, bg=BG,
                  highlightthickness=0).pack(side="left", padx=(0, 6))
        c = badge_row.children[next(iter(badge_row.children))]
        c.create_oval(1, 1, 7, 7, fill=ACCENT2, outline="")
        tk.Label(badge_row, text="SYSTEM ONLINE  ·  ML v2.1",
                 font=("Courier", 9), fg=ACCENT, bg=BG).pack(side="left")

        tk.Label(hdr, text="VEHICLE ID SYSTEM",
                 font=("Courier", 22, "bold"), fg=WHITE, bg=BG).pack(anchor="w", pady=(8, 2))
        tk.Label(hdr, text="Tank vs Non-Tank  ·  Seismic Sensor Analysis",
                 font=("Courier", 9), fg=MUTED, bg=BG).pack(anchor="w")

        # ── System Info Row ──────────────────
        info_frame = tk.Frame(self, bg=SURFACE, bd=0)
        info_frame.pack(fill="x", padx=28, pady=(20, 0))
        tk.Frame(info_frame, bg=BORDER, height=1).pack(fill="x")

        cells = tk.Frame(info_frame, bg=SURFACE)
        cells.pack(fill="x")

        for label, value, sep in [
            ("MODEL", "RandomForest", True),
            ("INPUT", "3-Channel Seismic", True),
            ("FEATURES", "19-dim Vector", False),
        ]:
            cell = tk.Frame(cells, bg=SURFACE, padx=16, pady=10)
            cell.pack(side="left", expand=True, fill="both")
            tk.Label(cell, text=label, font=("Courier", 8),
                     fg=MUTED, bg=SURFACE).pack(anchor="w")
            tk.Label(cell, text=value, font=("Courier", 10, "bold"),
                     fg=TEXT, bg=SURFACE).pack(anchor="w", pady=(2, 0))
            if sep:
                tk.Frame(cells, bg=BORDER, width=1).pack(side="left", fill="y")

        tk.Frame(info_frame, bg=BORDER, height=1).pack(fill="x")

        # ── Upload Zone ──────────────────────
        upload_outer = tk.Frame(self, bg=BORDER, bd=0)
        upload_outer.pack(fill="x", padx=28, pady=(20, 0))

        self._upload_zone = tk.Frame(upload_outer, bg=SURFACE2, cursor="hand2")
        self._upload_zone.pack(fill="both", padx=1, pady=1)

        for w in [self._upload_zone]:
            w.bind("<Button-1>", self._browse_file)
            w.bind("<Enter>",    lambda e: self._upload_zone.config(bg="#1e2d45"))
            w.bind("<Leave>",    lambda e: self._upload_zone.config(bg=SURFACE2))

        upload_inner = tk.Frame(self._upload_zone, bg=SURFACE2, pady=24)
        upload_inner.pack(fill="both")
        upload_inner.bind("<Button-1>", self._browse_file)
        upload_inner.bind("<Enter>",    lambda e: self._upload_zone.config(bg="#1e2d45"))
        upload_inner.bind("<Leave>",    lambda e: self._upload_zone.config(bg=SURFACE2))

        tk.Label(upload_inner, text="⬆", font=("Courier", 26),
                 fg=ACCENT, bg=SURFACE2).pack()
        tk.Label(upload_inner, text="UPLOAD SENSOR FILE",
                 font=("Courier", 12, "bold"), fg=WHITE, bg=SURFACE2).pack(pady=(8, 2))
        tk.Label(upload_inner, text="Click to browse  ·  .txt format",
                 font=("Courier", 9), fg=MUTED, bg=SURFACE2).pack()

        for w in upload_inner.winfo_children():
            w.bind("<Button-1>", self._browse_file)

        # ── File Info Strip ──────────────────
        self._file_strip = tk.Frame(self, bg=SURFACE, height=36)
        self._file_strip.pack(fill="x", padx=28)
        self._file_strip.pack_propagate(False)
        self._file_strip.pack_forget()

        strip_inner = tk.Frame(self._file_strip, bg=SURFACE)
        strip_inner.pack(fill="both", expand=True, padx=14)

        tk.Label(strip_inner, text="📄", font=("Courier", 11),
                 fg=ACCENT, bg=SURFACE).pack(side="left", pady=8)
        self._fname_label = tk.Label(strip_inner, text="", font=("Courier", 9),
                                      fg=ACCENT, bg=SURFACE)
        self._fname_label.pack(side="left", padx=8, pady=8)

        # ── Analyze Button ───────────────────
        btn_frame = tk.Frame(self, bg=BG)
        btn_frame.pack(fill="x", padx=28, pady=(14, 0))

        self._analyze_btn = tk.Button(
            btn_frame,
            text="▶  ANALYZE SIGNAL",
            font=("Courier", 12, "bold"),
            fg=ACCENT,
            bg=SURFACE,
            activeforeground=WHITE,
            activebackground=SURFACE2,
            relief="flat",
            bd=0,
            pady=14,
            cursor="hand2",
            state="disabled",
            command=self._start_analysis,
        )
        self._analyze_btn.pack(fill="x")
        self._apply_btn_border(self._analyze_btn, enabled=False)

        # ── Error Strip ──────────────────────
        self._error_strip = tk.Frame(self, bg=SURFACE, pady=0)
        self._error_strip.pack(fill="x", padx=28)
        self._error_strip.pack_forget()
        self._error_label = tk.Label(self._error_strip, text="",
                                      font=("Courier", 9), fg=DANGER,
                                      bg=SURFACE, wraplength=460, justify="left",
                                      padx=14, pady=10)
        self._error_label.pack(anchor="w")

        # ── Result Card ──────────────────────
        self._result_outer = tk.Frame(self, bg=BORDER)
        self._result_outer.pack(fill="x", padx=28, pady=(18, 0))
        self._result_outer.pack_forget()

        result_card = tk.Frame(self._result_outer, bg=SURFACE)
        result_card.pack(fill="both", padx=1, pady=1)

        # Result header
        rh = tk.Frame(result_card, bg=SURFACE2, pady=8)
        rh.pack(fill="x")
        tk.Label(rh, text="  CLASSIFICATION RESULT",
                 font=("Courier", 9), fg=MUTED, bg=SURFACE2).pack(side="left")
        self._result_id = tk.Label(rh, text="", font=("Courier", 9),
                                    fg=MUTED, bg=SURFACE2)
        self._result_id.pack(side="right", padx=12)
        tk.Frame(result_card, bg=BORDER, height=1).pack(fill="x")

        # Result body
        rb = tk.Frame(result_card, bg=SURFACE, padx=20, pady=20)
        rb.pack(fill="x")

        # Icon box
        self._icon_box = tk.Frame(rb, bg=SURFACE2, width=70, height=70)
        self._icon_box.pack(side="left", padx=(0, 20))
        self._icon_box.pack_propagate(False)
        self._icon_label = tk.Label(self._icon_box, text="", font=("Courier", 28),
                                     bg=SURFACE2)
        self._icon_label.place(relx=0.5, rely=0.5, anchor="center")

        # Text
        txt = tk.Frame(rb, bg=SURFACE)
        txt.pack(side="left", fill="both", expand=True)
        tk.Label(txt, text="DETECTED VEHICLE TYPE",
                 font=("Courier", 8), fg=MUTED, bg=SURFACE).pack(anchor="w")
        self._result_val = tk.Label(txt, text="", font=("Courier", 28, "bold"),
                                     fg=WHITE, bg=SURFACE)
        self._result_val.pack(anchor="w", pady=(4, 4))
        self._result_sub = tk.Label(txt, text="", font=("Courier", 9),
                                     fg=MUTED, bg=SURFACE)
        self._result_sub.pack(anchor="w")

        # Confidence bar section
        tk.Frame(result_card, bg=BORDER, height=1).pack(fill="x")
        conf_frame = tk.Frame(result_card, bg=SURFACE, padx=20, pady=16)
        conf_frame.pack(fill="x")

        conf_top = tk.Frame(conf_frame, bg=SURFACE)
        conf_top.pack(fill="x", pady=(0, 8))
        tk.Label(conf_top, text="CONFIDENCE SCORE",
                 font=("Courier", 9), fg=MUTED, bg=SURFACE).pack(side="left")
        self._conf_val_label = tk.Label(conf_top, text="",
                                         font=("Courier", 13, "bold"),
                                         fg=WHITE, bg=SURFACE)
        self._conf_val_label.pack(side="right")

        self._conf_bar = AnimatedBar(conf_frame, bg=SURFACE2)
        self._conf_bar.pack(fill="x")

        # Status bar
        tk.Frame(result_card, bg=BORDER, height=1).pack(fill="x")
        sb = tk.Frame(result_card, bg=SURFACE2, pady=8)
        sb.pack(fill="x")

        self._status_dot = StatusDot(sb)
        self._status_dot.pack(side="left", padx=(12, 6))
        self._status_text = tk.Label(sb, text="Ready", font=("Courier", 9),
                                      fg=MUTED, bg=SURFACE2)
        self._status_text.pack(side="left")
        self._ts_label = tk.Label(sb, text="", font=("Courier", 9),
                                   fg=MUTED, bg=SURFACE2)
        self._ts_label.pack(side="right", padx=12)

    # ── Helpers ────────────────────────────
    def _apply_btn_border(self, btn, enabled=True):
        color = ACCENT if enabled else BORDER
        btn.config(highlightbackground=color, highlightcolor=color,
                   highlightthickness=1)

    def _set_status(self, state, text):
        colors = {"ready": MUTED, "processing": "#ffa500", "ok": ACCENT2, "error": DANGER}
        self._status_dot.set_state(state)
        self._status_text.config(text=text, fg=colors.get(state, MUTED))

    def _show_error(self, msg):
        self._error_label.config(text=f"⚠  {msg}")
        self._error_strip.pack(fill="x", padx=28, pady=(6, 0))

    def _hide_error(self):
        self._error_strip.pack_forget()

    # ── Browse & Select ────────────────────
    def _browse_file(self, event=None):
        path = filedialog.askopenfilename(
            title="Select Vehicle Sensor File",
            filetypes=[("Text files", "*.txt")]
        )
        if not path:
            return
        self._file_path = path
        name = os.path.basename(path)
        self._fname_label.config(text=name)
        self._file_strip.pack(fill="x", padx=28, pady=(0, 0))
        self._analyze_btn.config(state="normal", fg=WHITE)
        self._apply_btn_border(self._analyze_btn, enabled=True)
        self._hide_error()
        self._result_outer.pack_forget()

    # ── Analysis (threaded) ────────────────
    def _start_analysis(self):
        self._hide_error()
        self._analyze_btn.config(state="disabled", text="⏳  ANALYZING...", fg=MUTED)
        self._apply_btn_border(self._analyze_btn, enabled=False)
        self._set_status("processing", "Processing signal...")
        self.update_idletasks()
        threading.Thread(target=self._run_prediction, daemon=True).start()

    def _run_prediction(self):
        try:
            signal = read_vehicle_file(self._file_path)
            if signal.shape[0] == 0:
                self.after(0, self._on_error, "No valid sensor data found in file.")
                return

            # simulate slight delay for UX
            time.sleep(0.4)

            features = extract_features(signal)
            probs    = model.predict_proba(features)[0]
            pred     = int(np.argmax(probs))
            conf     = float(probs[pred]) * 100
            rows     = signal.shape[0]

            self.after(0, self._on_result, pred, conf, rows)

        except Exception:
            self.after(0, self._on_error, traceback.format_exc())

    def _on_error(self, msg):
        self._show_error(msg)
        self._analyze_btn.config(state="normal",
                                  text="▶  ANALYZE SIGNAL", fg=ACCENT)
        self._apply_btn_border(self._analyze_btn, enabled=True)
        self._set_status("error", "Error — check file")

    def _on_result(self, pred, confidence, rows):
        import random, datetime
        is_tank  = pred == 1
        label    = "TANK" if is_tank else "NON-TANK"
        color    = TANK_COLOR if is_tank else NON_COLOR
        icon     = "🪖" if is_tank else "🚛"
        sub_text = f"{rows:,} samples  ·  {'Hostile vehicle detected' if is_tank else 'Non-hostile vehicle'}"
        result_id = f"ID #{random.randint(10000, 99999)}"
        ts        = datetime.datetime.now().strftime("%H:%M:%S")

        # Icon box color
        icon_bg = "#0d2a1a" if is_tank else "#0a1e2d"
        self._icon_box.config(bg=icon_bg)
        self._icon_label.config(text=icon, bg=icon_bg)

        self._result_val.config(text=label, fg=color)
        self._result_sub.config(text=sub_text)
        self._result_id.config(text=result_id)
        self._conf_val_label.config(text=f"{confidence:.2f}%")
        self._conf_bar.set_color(color)
        self._ts_label.config(text=ts)

        # Show result card
        self._result_outer.pack(fill="x", padx=28, pady=(18, 28))
        self.update_idletasks()
        self._conf_bar.animate_to(confidence)

        self._set_status("ok", "Prediction complete ✔")
        self._analyze_btn.config(state="normal",
                                  text="▶  ANALYZE SIGNAL", fg=ACCENT)
        self._apply_btn_border(self._analyze_btn, enabled=True)


# ─────────────────────────────────────────
# Run
# ─────────────────────────────────────────
if __name__ == "__main__":
    app = VehicleClassifierApp()
    app.mainloop()