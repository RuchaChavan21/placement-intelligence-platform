from fastapi import FastAPI
from app.db import SessionLocal
from app.rag.data_loader import load_placement_documents
from app.rag.vector_store import build_vector_store
from app.rag.chatbot import create_chatbot
from app.rag import cache
from app.chat_api import router as chat_router

app = FastAPI(title="Campus Placement Intelligence Platform")
app.include_router(chat_router)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        docs = load_placement_documents(db)

        cache.vectorstore = build_vector_store(docs)
        cache.chatbot = create_chatbot(cache.vectorstore)

        print(f"Vector store initialized with {len(docs)} documents")
    finally:
        db.close()
