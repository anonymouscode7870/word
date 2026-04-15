# services/resume_parser.py

import pdfplumber
from docx import Document


def extract_text_from_pdf(file):
    """
    Extract text from PDF file
    """
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_text_from_docx(file):
    """
    Extract text from DOCX file
    """
    doc = Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def extract_resume_text(uploaded_file):
    """
    Detect file type and extract resume text
    """
    if uploaded_file.type == "application/pdf":
        return extract_text_from_pdf(uploaded_file)
    else:
        return extract_text_from_docx(uploaded_file)