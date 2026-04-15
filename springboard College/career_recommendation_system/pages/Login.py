# ============================================================
# pages/1_Login.py
# Authentication Page (Login + Signup with Email OTP)
# ============================================================

import streamlit as st
import time
from utils.email_utils import generate_otp, send_otp_email

from database import add_user, verify_user
# ------------------------------------------------------------
# Page Configuration
# ------------------------------------------------------------
st.set_page_config(page_title="Login")


# ------------------------------------------------------------
# Session Initialization
# ------------------------------------------------------------

# Login status
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

# Toggle between login and signup
if "show_signup" not in st.session_state:
    st.session_state.show_signup = False

# OTP storage
if "generated_otp" not in st.session_state:
    st.session_state.generated_otp = None

# OTP timestamp (for expiry)
if "otp_time" not in st.session_state:
    st.session_state.otp_time = None

# OTP sent flag (for cooldown)
if "otp_sent" not in st.session_state:
    st.session_state.otp_sent = False


# ------------------------------------------------------------
# If already logged in → Redirect to Dashboard
# ------------------------------------------------------------
if st.session_state.logged_in:
    st.switch_page("pages/Dashboard.py")


# ------------------------------------------------------------
# Page Title
# ------------------------------------------------------------
st.title("Login")


# ============================================================
# LOGIN FORM
# ============================================================
if not st.session_state.show_signup:

    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    # ------------------ LOGIN BUTTON -------------------------
    # if st.button("Login"):

    #     if verify_user(email="user@gmail.com", password="12345"):
    #         st.session_state.logged_in = True
    #         st.success("Login successful!")
    #         st.switch_page("pages/Dashboard.py")
    #     else:
    #         st.error("Invalid credentials")

    # st.divider()

    # ------------------Dummy LOGIN BUTTON -------------------------
    if st.button("Login"):

        # Temporary dummy credentials
        if email == "user@gmail.com" and password == "12345":
            st.session_state.logged_in = True
            st.success("Login successful!")
            st.switch_page("pages/Dashboard.py")
        else:
            st.error("Invalid credentials")

    st.divider()

    # Google Login (UI only)
    if st.button("Login with Google"):
        st.info("Google authentication will be implemented later.")

    # Switch to Signup
    if st.button("Create Account"):
        st.session_state.show_signup = True
        st.rerun()


# ============================================================
# SIGNUP FORM (Only visible when user clicks Create Account)
# ============================================================
else:

    st.subheader("Signup")

    # --------------------------------------------------------
    # Email + Get OTP (Side by side)
    # --------------------------------------------------------
    col1, col2 = st.columns([5, 1])

    with col1:
        signup_email = st.text_input("Email")

    with col2:
        st.markdown("<br>", unsafe_allow_html=True)

        # Disable resend if within cooldown period
        disable_button = False

        if st.session_state.otp_sent:
            elapsed = time.time() - st.session_state.otp_time
            if elapsed < 60:
                disable_button = True
                remaining = int(60 - elapsed)
                st.caption(f"Resend in {remaining}s")

        if st.button("Get OTP", disabled=disable_button):
            if signup_email:
                otp = generate_otp()
                st.session_state.generated_otp = otp
                st.session_state.otp_time = time.time()
                st.session_state.otp_sent = True

                send_otp_email(signup_email, otp)
                st.success("OTP sent to your email")
            else:
                st.error("Enter email first")

    # --------------------------------------------------------
    # Password & OTP Input
    # --------------------------------------------------------
    signup_password = st.text_input("Password", type="password")
    entered_otp = st.text_input("Enter OTP")

    # --------------------------------------------------------
    # Verify OTP & Signup
    # --------------------------------------------------------
    if st.button("Verify OTP & Signup"):

        if not st.session_state.generated_otp:
            st.error("Please generate OTP first")

        else:
            elapsed = time.time() - st.session_state.otp_time

            # OTP Expiry: 2 minutes
            if elapsed > 120:
                st.error("OTP expired. Please request new OTP.")
                st.session_state.generated_otp = None
                st.session_state.otp_sent = False

            # OTP Match
            elif entered_otp == st.session_state.generated_otp:

                if add_user(signup_email, signup_password):
                    st.success("Signup successful! Please login.")
                else:
                    st.error("User already exists.")

                st.session_state.generated_otp = None
                st.session_state.otp_sent = False
                st.session_state.show_signup = False
                st.rerun()
                st.success("Signup successful!")

                # Reset OTP states
                st.session_state.generated_otp = None
                st.session_state.otp_sent = False
                st.session_state.show_signup = False

                st.rerun()

            else:
                st.error("Invalid OTP")

    # --------------------------------------------------------
    # Back to Login
    # --------------------------------------------------------
    if st.button("Back to Login"):
        st.session_state.show_signup = False
        st.rerun()