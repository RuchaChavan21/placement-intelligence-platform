# Campus Placement Intelligence Platform
An AI-powered analytics platform that provides accurate, explainable insights from multi-year college placement data using Retrieval-Augmented Generation (RAG).

## Problem Statement
Colleges publish placement data across multiple PDFs and CSV files, making it difficult for students to:
find accurate placement statistics
analyze trends across years
get answers to natural language questions
Traditional dashboards require predefined queries and lack flexibility.


## Solution Overview
This project builds an AI-driven placement intelligence system that:
ingests multi-year placement data into a centralized database
pre-aggregates analytical summaries
uses a RAG-based chatbot to answer placement-related questions accurately
ensures transparency via citations and coverage indicators
The system avoids hallucination by restricting the LLM to verified, indexed data only.

## System Architecture
CSV Files (Year-wise)
        ↓
MySQL (placements table)
        ↓
SQL Aggregation (Summaries)
        ↓
FAISS Vector Store
        ↓
RAG Chatbot (Local LLM)

Key design principles:
1. Single normalized database table
2. Pre-aggregated, LLM-friendly summaries
3. Pure RAG (no runtime SQL or tool calling)
4. Admin-controlled refresh pipeline


## Tech Stack
Backend: 
1. FastAPI
2. SQLAlchemy
3. MySQL

AI / NLP: 
1. FAISS (Vector Store)
2. Ollama (Local LLM – LLaMA 3)
3. LangChain

Data Processing:
1. Pandas

Other:
1. Python
2. REST APIs


## Database Design
placements
----------------------------------
id
student_name
branch
company
package_lpa
academic_year

Why single table?
Enables easy multi-year analysis
Simplifies trend computation
Scales without schema changes

## Data Ingestion Pipeline
1. Year-wise CSV files are placed in data/raw/
2. A loader script automatically ingests all CSVs into MySQL
3. New academic years can be added without code changes
python scripts/load_to_mysql.py

## RAG Design
1. Instead of querying the database at runtime, the system:
2. Pre-computes analytical summaries (per year + overall)
3. Converts them into natural-language text
4. Stores them in a FAISS vector database

Uses RAG to answer user queries strictly from indexed knowledge

This ensures:
1. correctness
2. consistency
3. zero hallucination

## Chatbot Features
1. Natural language Q&A on placement data
2. Multi-year analytics support
3. Placement-only guardrails
4. Transparent citations
5. Coverage indicator showing data confidence

## Admin Refresh Endpoint
An admin-only endpoint allows rebuilding the knowledge base without restarting the server.

POST /admin/refresh
This:
1. re-generates summaries
2. rebuilds FAISS index
3. updates the chatbot in memory

## Challenges Faced & Solutions
Challenge	                              Solution
Partial answers from RAG	          Introduced pre-aggregated summaries
Incorrect analytics	                Removed runtime SQL & tool calling
Year-wise data mismatch	            Dynamic summary generation from DB
LLM hallucination	                  Strict RAG-only answers + guardrails


## How to Run Locally
# install dependencies
pip install -r requirements.txt

# load CSVs into MySQL
python scripts/load_to_mysql.py

# start backend
uvicorn app.main:app --reload


## Why This Project Stands Out
1. Uses industry-standard RAG architecture
2. Avoids LLM hallucination by design
3. Scales to multiple years without schema changes
4. Demonstrates system design, not just coding


## Author
Rucha Chavan
Java Backend | DSA | AI Systems | RAG-based Applications
