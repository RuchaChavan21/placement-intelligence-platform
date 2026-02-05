from fastapi import FastAPI
from app.db import SessionLocal
from app.rag.data_loader import load_placement_documents
from app.rag.vector_store import build_vector_store
from app.rag.chatbot import create_chatbot
from app.rag import cache
from app.chat_api import router as chat_router
from app.services.summary_builder import build_placement_summary, get_all_academic_years
from app.admin_api import router as admin_router


app = FastAPI(title="Campus Placement Intelligence Platform")
app.include_router(chat_router)
app.include_router(admin_router)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # 1️ Raw placement docs (per-student)
        raw_docs = load_placement_documents(db)

        # 2️ LLM-friendly summary docs (GLOBAL KNOWLEDGE)
        from app.services.summary_builder import (
            build_placement_summary,
            get_all_academic_years
        )

        years = get_all_academic_years()

        summary_docs = [
            build_placement_summary(year) for year in years
        ]

        # optional: overall summary
        summary_docs.append(build_placement_summary())


        # 3 Combine
        all_docs = raw_docs + summary_docs

        cache.vectorstore = build_vector_store(all_docs)
        cache.chatbot = create_chatbot(cache.vectorstore)

        print(f"Vector store initialized with {len(all_docs)} documents")

    finally:
        db.close()
