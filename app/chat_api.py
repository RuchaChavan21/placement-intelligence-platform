from fastapi import APIRouter, Query
from app.rag import cache

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

@router.post("/chat")
def chat(query: str = Query(...)):
    if cache.chatbot is None:
        return {"error": "Vector store not initialized"}

    answer = cache.chatbot.invoke(query)

    return {
        "question": query,
        "answer": answer
    }
