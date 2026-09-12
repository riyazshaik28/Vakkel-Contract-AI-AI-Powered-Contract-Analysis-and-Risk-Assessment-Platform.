import os
from PyPDF2 import PdfReader

def  extract_text_from_txt(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return {"text":text.strip(), "page_count":1, "word_count":str(len(text.split()))}

def extract_text_from_pdf(file_path: str)->dict:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return {"text":text.strip(), "page_count":len(reader.pages), "word_count":str(len(text.split()))}

def extract_text(file_path: str):
    """
    Extracts text from a file.

    Args:
        file_path (str): The path to the file.

    Returns:
        str: The extracted text.
    """

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)

    elif ext == ".docx":
        return extract_text_from_doc(file_path)

    elif ext == ".txt":
        return extract_text_from_txt(file_path)

    else:
        raise ValueError(
            "Unsupported file type. Only PDF, DOCX, and TXT files are allowed."
        )