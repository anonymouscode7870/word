# ============================================================
# app.py
# Intelligent Career Recommendation System - Home Page
# ============================================================

import streamlit as st

from database import create_users_table

create_users_table()

# ------------------------------------------------------------
# Page Configuration
# ------------------------------------------------------------
st.set_page_config(
    page_title="Intelligent Career Recommendation System",
    page_icon="💼",
    layout="wide"
)

# ------------------------------------------------------------
# Custom Styling (Remove bottom spacing & default footer)
# ------------------------------------------------------------
st.markdown(
    """
    <style>
        footer {visibility: hidden;}
        .block-container {
            padding-top: 2rem;
            padding-bottom: 1rem;
        }
    </style>
    """,
    unsafe_allow_html=True
)

# ------------------------------------------------------------
# Hero Section
# ------------------------------------------------------------
st.markdown(
    """
    <h1 style='text-align: center;'>💼 Intelligent Career Recommendation System</h1>
    <p style='text-align: center; font-size:18px;'>
        AI-Powered Resume Analysis & Smart Job Matching Platform
    </p>
    """,
    unsafe_allow_html=True
)

st.write("")

# Centered Button
col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    if st.button(" Go to Dashboard", use_container_width=True):
        st.switch_page("pages/Dashboard.py")

st.divider()

# ------------------------------------------------------------
# Features Section
# ------------------------------------------------------------
st.subheader("✨ Platform Features")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("### 📄 Resume Analysis")
    st.write(
        "Upload your resume and extract structured insights including skills, experience, strengths, and weaknesses."
    )

with col2:
    st.markdown("### 🤖 AI-Powered Evaluation")
    st.write(
        "Leverage AI models to analyze your resume intelligently and identify missing skills."
    )

with col3:
    st.markdown("###  Smart Job Recommendations")
    st.write(
        "Match your skills with job requirements and receive personalized career suggestions."
    )

st.divider()

# ------------------------------------------------------------
# How It Works Section
# ------------------------------------------------------------
st.subheader("⚙ How It Works")

st.markdown(
    """
    1️⃣ Login or Create an Account  
    2️⃣ Upload Your Resume  
    3️⃣ AI Analyzes Your Profile  
    4️⃣ Get Smart Career Recommendations  
    """
)

st.divider()

# ------------------------------------------------------------
# Footer
# ------------------------------------------------------------
st.markdown(
    """
    
    <hr>
    <p style='text-align: center; font-size:14px; margin-bottom:10px;'>
        Built with ❤️ by <b>Jay</b> | AI Integration | Streamlit Architecture
    </p>
    """,
    unsafe_allow_html=True
)

