from fastapi import APIRouter
from app.db import SessionLocal
from app.rag.data_loader import load_placement_documents
from app.rag.vector_store import build_vector_store
from app.rag.chatbot import create_chatbot
from app.services.summary_builder import (
    build_placement_summary,
    get_all_academic_years
)
from app.rag import cache

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/refresh")
def refresh_knowledge_base():
    db = SessionLocal()
    try:
        # 1️ Raw placement docs
        raw_docs = load_placement_documents(db)

        # 2️ Year-wise summaries
        years = get_all_academic_years()
        summary_docs = [build_placement_summary(y) for y in years]

        # 3️ Overall summary
        summary_docs.append(build_placement_summary())

        # 4️ Combine everything
        all_docs = raw_docs + summary_docs

        # 5️ Rebuild vector store + chatbot
        cache.vectorstore = build_vector_store(all_docs)
        cache.chatbot = create_chatbot(cache.vectorstore)

        return {
            "status": "success",
            "message": "Knowledge base refreshed successfully",
            "documents_indexed": len(all_docs)
        }

    finally:
        db.close()
