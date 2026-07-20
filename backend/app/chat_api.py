from fastapi import APIRouter, Query
from app.rag import cache
from app.services.coverage import get_total_records
from app.services.analytics_service import get_sql_analytics
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

def detect_query_type(query: str, llm) -> str:
    prompt = ChatPromptTemplate.from_template(
        "Classify the following query into exactly one of two categories: 'sql' or 'rag'.\n"
        "'sql' is for analytical queries involving numbers, stats, highest, average, most, least, counts, branch-wise placements, top recruiters, package etc.\n"
        "'rag' is for subjective queries like interview experiences, tips, selection process, difficulty, etc.\n"
        "Respond with exactly one word: 'sql' or 'rag'.\n\nQuery: {query}"
    )
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({"query": query}).strip().lower()
    
    if "sql" in response:
        return "sql"
    return "rag"

@router.post("/chat")
def chat(query: str = Query(...)):
    llm = cache.chatbot
    if llm is None:
        return {"error": "Chatbot not initialized"}

    # 1. Detect Intent via Semantic Routing
    query_type = detect_query_type(query, llm)
    citation = ""

    # 2. Route Query
    if query_type == "sql":
        raw_sql_result = get_sql_analytics(query)
        
        # Format the SQL response using LLM
        prompt = ChatPromptTemplate.from_template(
            "You are a helpful placement analytics assistant.\n"
            "Format the following raw SQL data into a clear, natural language response to answer the user's question.\n"
            "Do not add any outside information. Be concise and accurate.\n\n"
            "User Question: {question}\nRaw Data: {data}\n\nFinal Answer:"
        )
        chain = prompt | llm | StrOutputParser()
        answer = chain.invoke({"question": query, "data": raw_sql_result})
        citation = "Placement SQL Database (Real-time Analytics)"
        
    else:
        # RAG Path
        vectorstore = cache.vectorstore
        
        # Dynamically build retriever with metadata filtering
        retriever = vectorstore.as_retriever(
            search_kwargs={
                "k": 5,
                "filter": {"type": "interview_experience"}
            }
        )
        
        docs = retriever.invoke(query)
        
        if not docs:
            answer = "No relevant placement information found."
        else:
            context = "\n\n".join(doc.page_content for doc in docs)
            prompt = ChatPromptTemplate.from_template(
                "You are a placement analytics assistant.\n\n"
                "Use ONLY the information provided in the context below.\n"
                "Answer clearly and concisely in plain English.\n"
                "DO NOT mention document IDs, metadata, or the word 'Document'.\n\n"
                "If the context does not contain enough data to answer, say 'No relevant placement information found.'\n\n"
                "Context:\n{context}\n\n"
                "Question:\n{question}\n\nFinal Answer:"
            )
            chain = prompt | llm | StrOutputParser()
            answer = chain.invoke({"question": query, "context": context})
            
            # Post-check if LLM failed to find answer in context
            if "I don't have enough data" in answer or "No relevant placement information found" in answer:
                answer = "No relevant placement information found."
                
        citation = "Placement Summaries (RAG Knowledge Base)"

    coverage = get_total_records()

    return {    
        "question": query,
        "answer": answer,
        "citation": citation,
        "coverage": f"Based on data from {coverage} placement records",
        "query_type": query_type
    }