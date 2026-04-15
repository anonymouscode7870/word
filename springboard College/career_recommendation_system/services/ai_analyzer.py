# ============================================================
# services/ai_analyzer.py
# Resume AI Analyzer (Dummy Intelligent Logic)
# ============================================================

def analyze_resume(resume_text):
    """
    Simulated AI Resume Analysis.
    Later we will replace with real OpenAI API.
    """

    text = resume_text.lower()

    skills = []

    if "python" in text:
        skills.append("Python")

    if "java" in text:
        skills.append("Java")

    if "machine learning" in text:
        skills.append("Machine Learning")

    if "react" in text:
        skills.append("React")

    if "sql" in text:
        skills.append("SQL")

    if not skills:
        skills.append("No major skills detected")

    return {
        "skills": skills,
        "education": "Detected from resume text (simulated)",
        "experience": "Experience extracted (simulated)",
        "strengths": "Strong technical foundation and adaptability.",
        "weaknesses": "May need improvement in advanced system design.",
        "missing_skills": "Cloud, DevOps (example suggestion)"
    }