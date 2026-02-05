# 🎓 Campus Placement Intelligence Platform

An **AI-powered analytics platform** that provides **accurate, explainable insights** from multi-year college placement data using **Retrieval-Augmented Generation (RAG)**.

---

## ❓ Problem Statement

Colleges publish placement data across multiple **PDFs and CSV files**, making it difficult for students to:

- 📊 Find accurate placement statistics  
- 📈 Analyze trends across years  
- 💬 Get answers to natural language questions  

Traditional dashboards:
- Require predefined queries  
- Lack flexibility  
- Fail to explain results clearly  

---

## 💡 Solution Overview

This project builds an **AI-driven placement intelligence system** that:

- 📥 Ingests multi-year placement data into a centralized database  
- 🧮 Pre-aggregates analytical summaries  
- 🤖 Uses a **RAG-based chatbot** to answer placement-related questions accurately  
- 🔍 Ensures transparency via **citations** and **coverage indicators**  

🚫 The system avoids hallucination by **restricting the LLM to verified, indexed data only**.

---

## 🏗️ System Architecture

```
CSV Files (Year-wise)
        ↓
MySQL (placements table)
        ↓
SQL Aggregation (Summaries)
        ↓
FAISS Vector Store
        ↓
RAG Chatbot (Local LLM)
```

### 🔑 Key Design Principles

1. Single normalized database table  
2. Pre-aggregated, LLM-friendly summaries  
3. Pure RAG (no runtime SQL or tool calling)  
4. Admin-controlled refresh pipeline  

---

## 🧰 Tech Stack

### Backend
- FastAPI  
- SQLAlchemy  
- MySQL  

### AI / NLP
- FAISS (Vector Store)  
- Ollama (Local LLM – LLaMA 3)  
- LangChain  

### Data Processing
- Pandas  

### Other
- Python  
- REST APIs  

---

## 🗄️ Database Design

**placements**

```
----------------------------------
id  
student_name  
branch  
company  
package_lpa  
academic_year  
```

### Why a Single Table?

- ✅ Enables easy multi-year analysis  
- ✅ Simplifies trend computation  
- ✅ Scales without schema changes  

---

## 🔄 Data Ingestion Pipeline

1. Year-wise CSV files are placed in `data/raw/`  
2. A loader script automatically ingests all CSVs into MySQL  
3. New academic years can be added **without code changes**

📄 Script:
```
python scripts/load_to_mysql.py
```

---

## 🧠 RAG Design

Instead of querying the database at runtime, the system:

1. Pre-computes analytical summaries (per year + overall)  
2. Converts them into natural-language text  
3. Stores them in a **FAISS vector database**  

The chatbot answers queries **strictly from indexed knowledge**.

### This ensures:
- ✔️ Correctness  
- ✔️ Consistency  
- ✔️ Zero hallucination  

---

## 🤖 Chatbot Features

- 💬 Natural language Q&A on placement data  
- 📆 Multi-year analytics support  
- 🛡️ Placement-only guardrails  
- 🔗 Transparent citations  
- 📊 Coverage indicator showing data confidence  

---

## 🔐 Admin Refresh Endpoint

An **admin-only endpoint** allows rebuilding the knowledge base **without restarting the server**.

```
POST /admin/refresh
```

This endpoint:
1. Re-generates summaries  
2. Rebuilds FAISS index  
3. Updates the chatbot in memory  

---

## ⚙️ Challenges Faced & Solutions

| Challenge                     | Solution |
|------------------------------|----------|
| Partial answers from RAG     | Introduced pre-aggregated summaries |
| Incorrect analytics          | Removed runtime SQL & tool calling |
| Year-wise data mismatch     | Dynamic summary generation from DB |
| LLM hallucination            | Strict RAG-only answers + guardrails |

---

## ▶️ How to Run Locally

```bash
# install dependencies
pip install -r requirements.txt

# load CSVs into MySQL
python scripts/load_to_mysql.py

# start backend
uvicorn app.main:app --reload
```

---

## 🌟 Why This Project Stands Out

1. Uses **industry-standard RAG architecture**  
2. Avoids **LLM hallucination by design**  
3. Scales to multiple years without schema changes  
4. Demonstrates **system design**, not just coding  

---

## 👩‍💻 Author

**Rucha Chavan**  
Java Backend | DSA | AI Systems | RAG-based Applications
