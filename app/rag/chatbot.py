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
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 5},
        return_source_documents=False
    )


    prompt = ChatPromptTemplate.from_template(
    """
    You are a placement analytics assistant.

    Use ONLY the information provided in the context below.
    Answer clearly and concisely in plain English.

    DO NOT:
    - mention document IDs
    - mention metadata
    - mention the word "Document"
    - expose the context directly

    If the answer is not present, say: "I don't have enough data."

    Context:
    {context}

    Question:
    {question}

    Final Answer:
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
