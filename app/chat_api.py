from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.rag.data_loader import load_placement_documents
from app.rag.vector_store import build_vector_store
from app.rag.chatbot import create_chatbot
from app.rag.cache import vectorstore

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])



router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/chat")
def chat(query: str):
    if vectorstore is None:
        return {"error": "Vector store not initialized"}

    chatbot = create_chatbot(vectorstore)
    answer = chatbot.invoke({"question": query})

    return {
        "question": query,
        "answer": answer
    }