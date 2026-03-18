import sys
import math
import matplotlib.pyplot as plt
from collections import deque


# ==========================================
# ALGORITHM PROCESSOR CLASS
# ==========================================
class MineAlgorithmProcessor:
    def __init__(self):
        # --- Hardware Specifications ---
        self.sampling_rate = 1000  # 1000 samples per second (1ms per sample)
        self.trigger_threshold = 200.0  # 200mV differential signal required to wake up algorithm

        # --- Base Buffers (Phase 1) ---
        # Stores the last 2000ms of data to calculate the environmental baseline when triggered
        self.base_window_size = 2000
        self.buf_abs = deque(maxlen=self.base_window_size)
        self.buf_diff = deque(maxlen=self.base_window_size)

        # --- Rolling Analysis Windows (Phases 2 & 3) ---
        self.win_10ms_diff = deque(maxlen=10)  # Used for detecting sharp, rapid tyre spikes
        self.win_50ms_seis = deque(maxlen=50)  # Used for detecting raw seismic amplitude (weight)
        self.win_400ms_seis = deque(maxlen=400)  # Used for counting high-frequency track clatter

        # --- Dynamic Flat Tracking ---
        self.flat_window_belly = deque()
        self.flat_window_track = deque()
        self.belly_flat_counter_ms = 0
        self.track_flat_counter_ms = 0

        # --- State Tracking ---
        self.is_triggered = False
        self.base_rms_abs = 0.0
        self.base_rms_diff = 0.0
        self.sample_count = 0  # Universal clock (milliseconds since start)

        # --- Envelope Tracking ---
        self.envelope_counter = 0
        self.current_5ms_max_abs = 0.0

        # --- Algorithm Flags ---
        self.abs_belly_flag = False
        self.abs_track_flag = False
        self.seis_belly_flag = False
        self.seis_track_flag = False

        # --- Tyred Vehicle Trackers ---
        self.tyre_flag = False
        self.tyre_peak_count = 0
        self.in_tyre_peak = False
        self.last_tyre_peak_sample = -9999

        # --- Trailing Edge & Peak Trackers ---
        self.diff_peaked_1000 = False
        self.max_diff_val = 0.0  # Tracks the absolute highest differential peak achieved
        self.max_delta_vp_a = 0.0  # Tracks the absolute highest magnetic signal achieved
        self.belly_flat_peak = 0.0
        self.track_flat_peak = 0.0

        # --- DELAYED FIRING TRACKERS ---
        # Delays the Belly Fire command by 20ms to ensure the detonation
        # hits the dead-center of the tank belly, not the front edge.
        self.belly_delay_active = False
        self.belly_delay_counter = 0
        self.belly_delay_ms = 20

        # --- System Halt ---
        self.ignore_samples = 0  # Used to pause scanning when a tyre passes or fire is revoked

    def calculate_rms(self, buffer):
        """Calculates the Root Mean Square of a buffer to establish a stable environmental baseline."""
        if not buffer: return 0.0
        return math.sqrt(sum(val * val for val in buffer) / len(buffer))

    def count_fluctuations(self, buffer):
        """Counts how many times a signal crosses its own mean. Detects high-frequency tank track clatter."""
        if len(buffer) < 2: return 0
        mean_val = sum(buffer) / len(buffer)
        crossings = 0
        for i in range(1, len(buffer)):
            if (buffer[i - 1] - mean_val) * (buffer[i] - mean_val) < 0:
                crossings += 1
        return crossings

    def process_row(self, row_data):
        # Step 1: Parse the raw text row
        try:
            val_abs, val_diff, val_seis, _ = [float(x) for x in row_data.split()]
        except ValueError:
            return "ERROR_PARSING_ROW"

        # Step 2: Check if system is currently halted (e.g., waiting for a truck to pass)
        if self.ignore_samples > 0:
            self.ignore_samples -= 1
            if self.ignore_samples == 0:
                return "RESUMED"
            return "PAUSED"

        self.sample_count += 1

        # ==========================================
        # PHASE 1: PRE-TRIGGER BASELINE
        # ==========================================
        if not self.is_triggered:
            self.buf_abs.append(val_abs)
            self.buf_diff.append(val_diff)

            # Wake up algorithm if differential signal breaks 200mV
            if val_diff > self.trigger_threshold:
                self.is_triggered = True
                self.base_rms_abs = self.calculate_rms(self.buf_abs)
                self.base_rms_diff = self.calculate_rms(self.buf_diff)

            return "GATHERING_BASELINE"

        # ==========================================
        # PHASE 2: POST-TRIGGER PROCESSING
        # ==========================================
        # Update high-frequency rolling windows
        self.win_10ms_diff.append(val_diff)
        self.win_50ms_seis.append(val_seis)
        self.win_400ms_seis.append(val_seis)

        # Track the global peaks for differential and absolute signals
        if val_diff > self.max_diff_val:
            self.max_diff_val = val_diff
        if val_diff >= 1000:
            self.diff_peaked_1000 = True

        # Subtract environmental baseline from absolute signal
        delta_vp_a = val_abs - self.base_rms_abs

        # --- 5ms Enveloping Logic ---
        # We evaluate the maximum value found in every 5ms block to smooth the data
        self.envelope_counter += 1
        if delta_vp_a > self.current_5ms_max_abs:
            self.current_5ms_max_abs = delta_vp_a

        if self.envelope_counter >= 5:
            env_val = self.current_5ms_max_abs

            # AUTO-RESET: If the signal drops near zero (< 20mV), wipe all flags.
            # This clears out noise or handles the gap between separate vehicles.
            if env_val < 20:
                self.abs_belly_flag = False
                self.abs_track_flag = False
                self.seis_belly_flag = False
                self.seis_track_flag = False
                self.flat_window_belly.clear()
                self.flat_window_track.clear()
                self.belly_flat_peak = 0.0
                self.track_flat_peak = 0.0

            if env_val > self.max_delta_vp_a:
                self.max_delta_vp_a = env_val

            # --- A. BELLY FLAT DETECTION ---
            # A belly is defined as a plateau (variance < 20mV) sitting between 40mV and 300mV.
            self.flat_window_belly.append(env_val)
            while len(self.flat_window_belly) > 0 and (max(self.flat_window_belly) - min(self.flat_window_belly)) > 20:
                self.flat_window_belly.popleft()  # Pop oldest until variance is compliant
            self.belly_flat_counter_ms = len(self.flat_window_belly) * 5

            # Raise Belly Flag if flat for > 100ms inside the valid amplitude range
            if self.belly_flat_counter_ms > 100 and (40 < env_val <= 300):
                self.abs_belly_flag = True
                if env_val > self.belly_flat_peak:
                    self.belly_flat_peak = env_val

            # Revoke Belly Flag if signal climbs past the allowed false flat
            if self.abs_belly_flag and env_val > self.belly_flat_peak + 15:
                self.abs_belly_flag = False
                self.belly_flat_peak = 0.0

            # Mathematically, a true belly cannot exceed 300mV.
            if env_val > 300:
                self.abs_belly_flag = False

            # --- B. TRACK FLAT DETECTION ---
            # A track flat is only valid if it remains near the massive global maximum (> 700mV).
            if env_val >= self.max_delta_vp_a - 30:
                self.flat_window_track.append(env_val)
                while len(self.flat_window_track) > 0 and (self.max_delta_vp_a - min(self.flat_window_track)) > 50:
                    self.flat_window_track.popleft()
                self.track_flat_counter_ms = len(self.flat_window_track) * 5

                # Raise Track flag if flat for > 100ms
                if self.track_flat_counter_ms > 100 and self.max_delta_vp_a > 700:
                    self.abs_track_flag = True
                    if env_val > self.track_flat_peak:
                        self.track_flat_peak = env_val

                if self.abs_track_flag and env_val > self.track_flat_peak + 20:
                    self.abs_track_flag = False
                    self.track_flat_peak = 0.0
            else:
                self.flat_window_track.clear()

            # Reset 5ms envelope
            self.envelope_counter = 0
            self.current_5ms_max_abs = 0.0

        # ==========================================
        # PHASE 3: FLAG EVALUATION
        # ==========================================
        # Count frequency of seismic clatter
        current_fluctuations = 0
        if len(self.win_400ms_seis) == 400:
            current_fluctuations = self.count_fluctuations(self.win_400ms_seis)

        # --- 1. Tyred Vehicle Logic (Multi-axle detection) ---
        if len(self.win_10ms_diff) == 10:
            diff_var_10ms = max(self.win_10ms_diff) - min(self.win_10ms_diff)

            if diff_var_10ms > 700:
                if not self.in_tyre_peak:
                    # Require 200ms gap between axles to prevent false double-counts
                    if (self.sample_count - self.last_tyre_peak_sample) > 200:
                        self.tyre_peak_count += 1
                        self.last_tyre_peak_sample = self.sample_count
                    self.in_tyre_peak = True
            elif diff_var_10ms < 200:
                self.in_tyre_peak = False

            if self.tyre_peak_count >= 2:
                self.tyre_flag = True

        # --- 2. Seismic Amplitude Logic ---
        # Calculate current live seismic vibration
        current_seis_variance = 0
        if len(self.win_50ms_seis) == 50:
            current_seis_variance = max(self.win_50ms_seis) - min(self.win_50ms_seis)
            if current_seis_variance > 80:
                self.seis_belly_flag = True
            if current_seis_variance > 700:
                self.seis_track_flag = True

        # ==========================================
        # PHASE 4: DECISION & FIRING CRITERIA
        # ==========================================
        # TANK OVERRIDE: If we have a massive flat AND high-frequency seismic clatter,
        # it is definitively a Tank Track, NOT a heavy truck. Revoke the Tyre flag.
        if self.abs_belly_flag or self.abs_track_flag:
            if current_fluctuations >= 10:
                self.tyre_flag = False
            else:
                self.tyre_flag = True

        # Assesses if the leading edge of a signal peak has passed and is actively dropping
        is_diff_falling = (self.max_diff_val - val_diff) > 100

        # --- 1. TRACK FIRE CHECK ---
        if self.abs_track_flag and (self.seis_track_flag) and not self.tyre_flag:
            if self.diff_peaked_1000 and val_diff < 1000 and is_diff_falling:

                # FINAL SEISMIC SANITY CHECK
                if current_seis_variance >= 100:
                    self.reset_post_trigger_state()
                    return "FIRE_TRACK"
                else:
                    self.ignore_samples = 3000  # Halt for 3 seconds
                    self.reset_post_trigger_state()
                    return "REVOKED_LOW_SEISMIC"

        # --- 2. THE TRACK VETO (TRAWL ROLLER PROTECTION) ---
        # Tanks with Mine Trawls create a massive magnetic spike, followed by an air gap
        # before the main track. If the absolute signal EVER goes above 700mV, we lock out
        # the Belly Fire entirely to prevent firing at the empty space behind a trawl.
        is_track_signature = (self.max_delta_vp_a >= 700)

        # --- 3. BELLY FIRE CHECK ---
        if self.abs_belly_flag and self.seis_belly_flag and not self.tyre_flag and not is_track_signature:

            # RULE A: Dynamic Differential Drop
            # Fast tanks might peak at 800mV, slow tanks at 250mV. We dynamically set the
            # drop target to 50% of whatever the max peak achieved was (capped at 350mV).
            dynamic_drop_target = min(350, self.max_diff_val * 0.5)
            diff_peaked_and_dropping = (self.max_diff_val >= 200) and (
                    val_diff < dynamic_drop_target) and is_diff_falling

            # RULE B: Fast Settled Plateau
            # If a tank is moving so slowly it never generates a differential peak, we rely
            # on the absolute signal being perfectly flat for 100ms, WHILE ensuring the
            # differential signal is quiet (< 150mV) to confirm we are under the belly.
            settled_plateau = (self.belly_flat_counter_ms >= 100) and (val_diff < 150)

            # Initiate Delay Timer
            if diff_peaked_and_dropping or settled_plateau:
                if not self.belly_delay_active:
                    self.belly_delay_active = True
                    self.belly_delay_counter = self.belly_delay_ms
                    return "DELAY_BELLY_INITIATED"

        # --- 4. PROCESS BELLY DELAY ---
        if self.belly_delay_active:
            self.belly_delay_counter -= 1
            if self.belly_delay_counter <= 0:
                self.belly_delay_active = False

                # FINAL SEISMIC SANITY CHECK
                if current_seis_variance >= 50:
                    self.reset_post_trigger_state()
                    return "FIRE_BELLY"
                else:
                    self.ignore_samples = 3000  # Halt for 3 seconds
                    self.reset_post_trigger_state()
                    return "REVOKED_LOW_SEISMIC"

        # --- 5. TYRED VEHICLE HALT ---
        # Wait until the differential signal quiets down (< 200mV) before halting
        # to ensure the truck's main axles have passed.
        if self.tyre_flag and val_diff < 200:
            self.ignore_samples = 3000  # 3000 ms = 3 seconds
            self.reset_post_trigger_state()
            return "HALT_3_SEC"

        return "PROCESSING"

    def reset_post_trigger_state(self):
        """Wipes all variables clean after a Tyred Vehicle passes to prepare for the next target."""
        self.is_triggered = False
        self.abs_belly_flag = False
        self.abs_track_flag = False
        self.seis_belly_flag = False
        self.seis_track_flag = False
        self.tyre_flag = False
        self.tyre_peak_count = 0
        self.in_tyre_peak = False
        self.diff_peaked_500 = False
        self.diff_peaked_1000 = False
        self.max_diff_val = 0.0
        self.max_delta_vp_a = 0.0
        self.belly_flat_peak = 0.0
        self.track_flat_peak = 0.0
        self.belly_flat_counter_ms = 0
        self.track_flat_counter_ms = 0
        self.belly_delay_active = False
        self.belly_delay_counter = 0
        self.win_10ms_diff.clear()
        self.win_50ms_seis.clear()
        self.flat_window_belly.clear()
        self.flat_window_track.clear()
        self.win_400ms_seis.clear()


# ==========================================
# DATA READING & PLOTTING FUNCTIONS
# ==========================================
def read_sensor_data(filepath):
    """Safely reads the 4-column raw text files."""
    t, data_lines, val_abs, val_diff, val_seis = [], [], [], [], []
    try:
        with open(filepath, 'r') as f:
            for i, line in enumerate(f):
                if not line.strip(): continue
                try:
                    v_a, v_d, v_s, _ = [float(x) for x in line.split()]
                    t.append(i / 1000.0)  # Convert line number to seconds
                    data_lines.append(line)
                    val_abs.append(v_a)
                    val_diff.append(v_d)
                    val_seis.append(v_s)
                except ValueError:
                    pass
    except FileNotFoundError:
        print(f"Error: Could not find the file '{filepath}'. Please check the path.")
        return None, None, None, None, None
    except OSError:
        print(f"Error: Invalid file path '{filepath}'.")
        return None, None, None, None, None
    return t, data_lines, val_abs, val_diff, val_seis


def run_analysis_and_plot(filepath):
    """Executes the processor line-by-line and generates visual plots."""
    print(f"\n--- Loading Data from: {filepath} ---")
    t, data_lines, val_abs, val_diff, val_seis = read_sensor_data(filepath)

    if t is None: return

    processor = MineAlgorithmProcessor()
    events = []

    # Dictionary used solely to prevent printing the same flag multiple times per event
    flag_states = {
        'Trigger': False, 'Tyre': False, 'Abs_Belly': False,
        'Abs_Track': False, 'Seis_Belly': False, 'Seis_Track': False
    }

    print("\n--- Event Log ---")

    for i, line in enumerate(data_lines):
        action = processor.process_row(line)
        current_time = t[i]

        # Log Trigger
        if processor.is_triggered and not flag_states['Trigger']:
            print(f"[{current_time:.3f} s] BASELINE TRIGGERED (Diff > 200mV)")
            events.append((current_time, 'Trigger', 'purple'))
            flag_states['Trigger'] = True

        # Log Tyre State
        if processor.tyre_flag and not flag_states['Tyre']:
            print(f"[{current_time:.3f} s] FLAG RAISED: Tyre (Low-Frequency/Peaks Detected)")
            events.append((current_time, 'Tyre Flag', 'gray'))
            flag_states['Tyre'] = True

        if not processor.tyre_flag and flag_states['Tyre']:
            print(f"[{current_time:.3f} s] FLAG REVOKED: Tyre (High-Frequency Track Clatter Confirmed)")
            flag_states['Tyre'] = False

        # Log Belly State
        if processor.abs_belly_flag and not flag_states['Abs_Belly']:
            print(f"[{current_time:.3f} s] FLAG RAISED: Abs_Belly (Flat for {processor.belly_flat_counter_ms} ms)")
            events.append((current_time, 'Abs Belly Flag', 'blue'))
            flag_states['Abs_Belly'] = True

        if not processor.abs_belly_flag and flag_states['Abs_Belly']:
            print(
                f"[{current_time:.3f} s] FLAG REVOKED: Abs_Belly (Signal climbed past false flat or exceeded ceiling)")
            flag_states['Abs_Belly'] = False

        # Log Track State
        if processor.abs_track_flag and not flag_states['Abs_Track']:
            print(f"[{current_time:.3f} s] FLAG RAISED: Abs_Track (Flat for {processor.track_flat_counter_ms} ms)")
            events.append((current_time, 'Abs Track Flag', 'cyan'))
            flag_states['Abs_Track'] = True

        if not processor.abs_track_flag and flag_states['Abs_Track']:
            print(f"[{current_time:.3f} s] FLAG REVOKED: Abs_Track (Signal dropped sharply)")
            flag_states['Abs_Track'] = False

        # Log Seismic States
        if processor.seis_belly_flag and not flag_states['Seis_Belly']:
            print(f"[{current_time:.3f} s] FLAG RAISED: Seis_Belly")
            events.append((current_time, 'Seis Belly Flag', 'orange'))
            flag_states['Seis_Belly'] = True

        if processor.seis_track_flag and not flag_states['Seis_Track']:
            print(f"[{current_time:.3f} s] FLAG RAISED: Seis_Track")
            events.append((current_time, 'Seis Track Flag', 'red'))
            flag_states['Seis_Track'] = True

        # Log Delay Firing
        if action == "DELAY_BELLY_INITIATED":
            print(f"[{current_time:.3f} s] >>> BELLY FIRE DELAY INITIATED ({processor.belly_delay_ms} ms) <<<")
            events.append((current_time, 'Delay Initiated', 'magenta'))
            flag_states = {k: False for k in flag_states}

        # Log Firing Revoked due to low seismic vibration
        if action == "REVOKED_LOW_SEISMIC":
            print(f"\n========================================")
            print(f"[{current_time:.3f} s] >>> FIRING REVOKED: Live Seismic Vibration < 100mV <<<")
            print(f"[{current_time:.3f} s] >>> HALTING FOR 3 SECONDS BEFORE RESUMING SCAN <<<")
            print(f"========================================\n")
            events.append((current_time, 'Revoked (Low Seismic)', 'red'))
            flag_states = {k: False for k in flag_states}

        # Log Halts & Resumes
        if action == "RESUMED":
            print(f"[{current_time:.3f} s] >>> RESUMED SCANNING AFTER HALT <<<")
            events.append((current_time, 'Resumed Scanning', 'green'))
            flag_states = {k: False for k in flag_states}

        # Log Firing Actions
        if action in ["FIRE_BELLY", "FIRE_TRACK", "HALT_3_SEC", "HALT_5_SEC"]:
            print(f"\n========================================")
            print(f"[{current_time:.3f} s] DECISION: {action}")
            print(f"========================================\n")
            events.append((current_time, f"ACTION: {action}", 'black'))

            flag_states = {k: False for k in flag_states}

            if action in ["FIRE_BELLY", "FIRE_TRACK"]:
                print(">>> Target destroyed. Halting further scanning. <<<")
                break  # <--- Added break back here. The program will now stop scanning the file when it fires.

    print("--- Generating Plots... Close the plot window to analyze another file. ---")
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10), sharex=True)

    ax1.plot(t, val_abs, color='b', alpha=0.7, label='Absolute Signal Vp(a)')
    ax1.set_ylabel('Voltage (mV)')
    ax1.set_title(f'Mine Sensor Signals - {filepath}')
    ax1.grid(True, linestyle='--', alpha=0.6)
    ax1.legend(loc='upper right')

    ax2.plot(t, val_diff, color='g', alpha=0.7, label='Differential Signal V(d)')
    ax2.axhline(y=200, color='r', linestyle='--', alpha=0.5, label='Trigger (200mV)')
    ax2.set_ylabel('Voltage (mV)')
    ax2.grid(True, linestyle='--', alpha=0.6)
    ax2.legend(loc='upper right')

    ax3.plot(t, val_seis, color='orange', alpha=0.7, label='Seismic Signal V(s)')
    ax3.set_ylabel('Voltage (mV)')
    ax3.set_xlabel('Time (seconds)')
    ax3.grid(True, linestyle='--', alpha=0.6)
    ax3.legend(loc='upper right')

    # Draw vertical lines for events
    for event_time, event_name, color in events:
        for ax in [ax1, ax2, ax3]:
            ax.axvline(x=event_time, color=color, linestyle='-', linewidth=2.5, alpha=0.9)
            if ax == ax1:
                # Adjust text position to avoid overlap
                y_pos = ax.get_ylim()[1] * 0.75 if "ACTION" not in event_name else ax.get_ylim()[1] * 0.9
                ax.annotate(event_name, xy=(event_time, y_pos),
                            xytext=(8, 0), textcoords='offset points',
                            rotation=90, color=color, fontweight='bold',
                            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec=color, lw=1.5, alpha=0.9))

    plt.tight_layout()
    plt.show()


# ==========================================
# EXECUTION
# ==========================================
if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_analysis_and_plot(sys.argv[1])

    while True:
        try:
            file_path = input("\nEnter path to next text file (or 'q' to quit): ").strip()
            file_path = file_path.strip('\'"')

            if file_path.lower() in ['q', 'quit', 'exit']:
                print("Exiting program. Goodbye!")
                break

            if not file_path:
                continue

            run_analysis_and_plot(file_path)

        except KeyboardInterrupt:
            print("\nExiting program. Goodbye!")
            break