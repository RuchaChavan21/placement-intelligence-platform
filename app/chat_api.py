from fastapi import APIRouter, Query
from app.rag import cache

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])


@router.post("/chat")
def chat(query: str = Query(...)):
    if cache.chatbot is None:
        return {"error": "Chatbot not initialized"}

    # LangChain Runnable → invoke()
    answer = cache.chatbot.invoke(query)

    return {
        "question": query,
        "answer": answer
    }
