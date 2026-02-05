from fastapi import APIRouter, Query
from app.rag import cache
from app.services.coverage import get_total_records


router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

PLACEMENT_KEYWORDS = [
    "placement", "package", "company", "companies",
    "branch", "recruit", "recruited", "trend", "salary"
]


@router.post("/chat")
def chat(query: str = Query(...)):
    q = query.lower()

    #  Guardrail: allow only placement-related questions
    if not any(word in q for word in PLACEMENT_KEYWORDS):
        return {
            "question": query,
            "answer": "I can help only with placement-related questions."
        }

    if cache.chatbot is None:
        return {"error": "Chatbot not initialized"}

    answer = cache.chatbot.invoke(query)

    #  Simple citation logic
    citation = "Placement summaries generated from official college data"

    coverage = get_total_records()

    return {    
        "question": query,
        "answer": answer,
        "citation": citation,
        "coverage": f"Based on data from {coverage} placement records"
    }