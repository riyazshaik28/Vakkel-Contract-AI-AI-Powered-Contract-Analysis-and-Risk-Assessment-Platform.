# ⚖️ Vakeel Contract AI

> AI-Powered Legal Contract Analysis Platform built with FastAPI, MongoDB, and Gemini AI.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

**Vakeel Contract AI** is an intelligent legal document analysis platform that automates contract review using Large Language Models (LLMs). The system analyzes uploaded contracts, extracts critical clauses, identifies legal risks, generates executive summaries, classifies contract types, and provides actionable recommendations.

The goal of this project is to reduce manual legal review effort and help organizations quickly understand contractual obligations and potential risks.

---

## 🚀 Key Features

### 📄 Contract Management
- Upload and store contracts securely
- Retrieve contracts using unique IDs
- Manage contract records through REST APIs

### 🤖 AI-Powered Contract Analysis
- Executive Summary Generation
- Contract Type Classification
- Key Clause Extraction
- Legal Risk Identification
- Risk Severity Assessment
- Actionable Recommendations

### ⚡ Backend Capabilities
- Asynchronous API Processing
- MongoDB Document Storage
- Pydantic Data Validation
- Structured JSON AI Responses
- Error Handling & Logging
- Scalable RESTful Architecture

---

## 🏗️ System Architecture

```text
User
 │
 ▼
FastAPI Backend
 │
 ├── Contract APIs
 │
 ├── MongoDB Storage
 │
 └── Gemini AI Integration
          │
          ▼
   Contract Analysis Engine
          │
          ▼
 Structured JSON Response
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Python | Core Programming Language |
| FastAPI | REST API Development |
| MongoDB | NoSQL Database |
| Pydantic | Data Validation |
| Gemini AI | Contract Analysis |
| AsyncIO | Asynchronous Processing |
| Uvicorn | ASGI Server |
| HTTPX | API Communication |

---

## 📂 Project Structure

```text
vakeel_contract_AI/
│
├── APP/
│   ├── routers/
│   ├── services/
│   ├── models/
│   ├── database/
│   ├── config.py
│   └── main.py
│
├── uploads/
├── requirements.txt
├── .env
└── README.md
```

---

## 🔍 AI Analysis Workflow

### Step 1
Upload a legal contract.

### Step 2
Contract content is extracted and processed.

### Step 3
Gemini AI analyzes:
- Contract Type
- Important Clauses
- Legal Risks
- Compliance Issues

### Step 4
Structured analysis is generated and stored in MongoDB.

### Step 5
Results are returned through FastAPI APIs.

---

## 📊 Sample Analysis Output

```json
{
  "executive_summary": "NDA between ABC Technologies and John Doe",
  "contract_type": "Non-Disclosure Agreement",
  "overall_risk_level": "Low",
  "recommendations": [
    "Add confidentiality exceptions",
    "Specify jurisdiction"
  ]
}
```

---

## 🔌 API Endpoints

### Contracts

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /contracts/upload | Upload Contract |
| GET | /contracts | Get All Contracts |
| GET | /contracts/{id} | Get Contract |

### Analysis

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /analysis/analysis/{contract_id} | Analyze Contract |
| GET | /analysis/{analysis_id} | Get Analysis |
| GET | /allanalysis | Get All Analyses |

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/vakeel_contract_AI.git
```

### Navigate

```bash
cd vakeel_contract_AI
```

### Create Virtual Environment

```bash
python -m venv env
```

### Activate Environment

Windows

```bash
env\Scripts\activate
```

Linux/Mac

```bash
source env/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### Run Application

```bash
uvicorn APP.main:app --reload
```

---

## 🎯 Learning Outcomes

This project demonstrates:

- REST API Development
- FastAPI Backend Architecture
- MongoDB Integration
- AI & LLM Integration
- Prompt Engineering
- Asynchronous Programming
- JSON Data Processing
- Contract Intelligence Systems
- Production-ready API Design

---

## 🌟 Future Enhancements

- PDF Contract Upload
- OCR for Scanned Documents
- Contract Comparison Engine
- Clause Similarity Search
- Vector Database Integration
- RAG-based Legal Knowledge Base
- Multi-Language Contract Support
- User Authentication & Authorization

---

## 👨‍💻 Author

**Shaik Riyaz**

Backend Developer | Python Developer | AI Enthusiast

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps the project reach more developers and encourages future improvements.
