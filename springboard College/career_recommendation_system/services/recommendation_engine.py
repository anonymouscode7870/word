# ============================================================
# services/recommendation_engine.py
# Simple Skill-Based Job Recommendation Engine
# ============================================================

def recommend_jobs(user_skills):
    """
    Match user skills with predefined job roles.
    Returns ranked job recommendations.
    """

    # Dummy job database (later can be replaced with scraped jobs)
    jobs = [
        {
            "title": "Python Developer",
            "skills_required": ["Python", "SQL"]
        },
        {
            "title": "Machine Learning Engineer",
            "skills_required": ["Python", "Machine Learning", "SQL"]
        },
        {
            "title": "Frontend Developer",
            "skills_required": ["React", "JavaScript"]
        },
        {
            "title": "Full Stack Developer",
            "skills_required": ["Python", "React", "SQL"]
        },
        {
            "title": "Java Developer",
            "skills_required": ["Java", "SQL"]
        }
    ]

    recommendations = []

    for job in jobs:
        matched_skills = set(user_skills) & set(job["skills_required"])
        match_percentage = int(
            (len(matched_skills) / len(job["skills_required"])) * 100
        )

        recommendations.append({
            "title": job["title"],
            "match_percentage": match_percentage,
            "matched_skills": list(matched_skills)
        })

    # Sort jobs by highest match %
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)

    return recommendations