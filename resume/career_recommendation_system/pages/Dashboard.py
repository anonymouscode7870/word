# ============================================================
# pages/Dashboard.py
# Resume Dashboard with AI Analysis
# ============================================================

import streamlit as st
import matplotlib.pyplot as plt
import time
from services.resume_parser import extract_resume_text
from services.ai_analyzer import analyze_resume
from services.recommendation_engine import recommend_jobs

# ------------------------------------------------------------
# Login Protection
# ------------------------------------------------------------
if "logged_in" not in st.session_state or not st.session_state.logged_in:
    st.switch_page("pages/Login.py")


st.title("📄 Resume Dashboard")

# Logout Button
if st.button("Logout"):
    st.session_state.logged_in = False
    st.switch_page("pages/1_Login.py")

st.divider()

# ------------------------------------------------------------
# Resume Upload
# ------------------------------------------------------------
uploaded_file = st.file_uploader(
    "Upload Resume (PDF/DOCX)",
    type=["pdf", "docx"]
)

if uploaded_file is not None:

    st.success("File uploaded successfully!")

    resume_text = extract_resume_text(uploaded_file)

    if st.button("🔍 Analyze Resume"):

        # Loading animation
        with st.spinner("Analyzing resume using AI..."):
            time.sleep(2)  # simulate processing delay
            result = analyze_resume(resume_text)

            # Calculate Resume Score (based on skill count)
        resume_score = min(len(result["skills"]) * 20, 100)

        # st.subheader("📊 Overall Resume Score")
        # st.progress(resume_score / 100)
        # st.write(f"Resume Score: {resume_score}%")
        # ----------------------------------------------------
# Premium Resume Score Display
# ----------------------------------------------------
        st.subheader("📊 Overall Resume Score")

        col1, col2 = st.columns([1,2])

        with col1:
            st.markdown(
                f"""
                <div style="
                    background: linear-gradient(135deg,#6366f1,#3b82f6);
                    padding:30px;
                    border-radius:15px;
                    text-align:center;
                    color:white;
                    font-size:28px;
                    font-weight:bold;
                ">
                    {resume_score}%
                </div>
                """,
                unsafe_allow_html=True
            )

        with col2:
            st.progress(resume_score / 100)
            st.caption("Resume strength calculated based on detected skills.")

        st.divider()
        

        # st.success("Analysis Completed!")

        # st.divider()

        # ----------------------------------------------------
        # Display Skills
        # ----------------------------------------------------
        st.subheader("🛠 Detected Skills")

        cols = st.columns(len(result["skills"]))

        for i, skill in enumerate(result["skills"]):
            cols[i].metric(label=skill, value="✔")

        st.divider()

        # ----------------------------------------------------
        # Strengths & Weaknesses
        # ----------------------------------------------------
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("💪 Strengths")
            st.info(result["strengths"])

        with col2:
            st.subheader("⚠ Weaknesses")
            st.warning(result["weaknesses"])

        st.divider()

        # ----------------------------------------------------
        # Missing Skills
        # ----------------------------------------------------
        st.subheader("📌 Suggested Skill Improvements")
        st.write(result["missing_skills"])
        st.divider()

        # ----------------------------------------------------
        # Skill Visualization Chart
        # ----------------------------------------------------
# ----------------------------------------------------
# Skill Visualization (Modern Compact Style)
# ----------------------------------------------------
        st.subheader("📈 Skill Strength Overview")

        skills = result["skills"]

        cols = st.columns(min(len(skills), 4))

        for i, skill in enumerate(skills):
            with cols[i % 4]:
                st.markdown(
                    f"""
                    <div style="
                        background: linear-gradient(135deg,#6366f1,#3b82f6);
                        padding:15px;
                        border-radius:12px;
                        text-align:center;
                        color:white;
                        font-weight:bold;
                        font-size:16px;
                    ">
                        {skill}
                    </div>
                    """,
                    unsafe_allow_html=True
                )

        st.divider()

# ----------------------------------------------------
# Job Recommendations
# ----------------------------------------------------
        # st.subheader("🎯 Job Recommendations")

        recommendations = recommend_jobs(result["skills"])

        # for job in recommendations:
        #     st.markdown(f"### {job['title']}")
        #     st.progress(job["match_percentage"] / 100)
        #     st.write(f"Match: {job['match_percentage']}%")
        #     st.write(f"Matched Skills: {', '.join(job['matched_skills'])}")
        #     st.divider()

            # ----------------------------------------------------
# Premium Job Recommendation Cards
# ----------------------------------------------------
        st.subheader("🎯 Job Recommendations")

        for job in recommendations:

            color = "#16a34a" if job["match_percentage"] > 60 else "#f59e0b"

            st.markdown(
                f"""
                <div style="
                    background-color:#111827;
                    padding:20px;
                    border-radius:15px;
                    margin-bottom:15px;
                    color:white;
                ">
                    <h4 style="margin:0;">{job['title']}</h4>
                    <p style="margin:5px 0;">Match: <b>{job['match_percentage']}%</b></p>
                </div>
                """,
                unsafe_allow_html=True
            )

            st.progress(job["match_percentage"] / 100)
            st.caption(f"Matched Skills: {', '.join(job['matched_skills'])}")