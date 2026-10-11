from langchain_groq import ChatGroq
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def create_chatbot(vectorstore=None):
    # Cloud LLM via Groq. Groq retires models over time, so the model is
    # configurable: set GROQ_MODEL in Render without a code change.
    llm = ChatGroq(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )
    return llm
