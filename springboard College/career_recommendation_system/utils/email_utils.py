# utils/email_utils.py

import smtplib
import random
from email.mime.text import MIMEText


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(receiver_email, otp):
    sender_email = "jay2221063@gmail.com"
    sender_password = "your_app_password"

    subject = "Your OTP Code"
    body = f"Your OTP is: {otp}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    # sender_password = "your_app_password" secret
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()