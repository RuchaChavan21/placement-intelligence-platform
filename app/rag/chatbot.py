from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


def create_chatbot(vectorstore):
    # Local LLM via Ollama
    llm = ChatOllama(
        model="llama3:8b",
        temperature=0
    )

    # Retriever from FAISS
    retriever = vectorstore.as_retriever()

    prompt = ChatPromptTemplate.from_template(
        """
        You are a placement data assistant.
        Answer ONLY using the given context.
        If the answer is not present, say "I don't have enough data."

        Context:
        {context}

        Question:
        {question}
        """
    )

    rag_chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain
