from dotenv import load_dotenv
from pathlib import Path
import os



load_dotenv(Path(__file__).parent / ".env")
MONGODB_URI = os.getenv("MONGODB_URI")

ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"]

MAXFILESIZE = 10 * 1024 * 1024  # 10 MB

UPLOAD_FOLDER = "uploads"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("Gemini Key:", GEMINI_API_KEY)