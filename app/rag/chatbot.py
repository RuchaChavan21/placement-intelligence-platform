# """from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.runnables import RunnablePassthrough
# from langchain_core.output_parsers import StrOutputParser


# def create_chatbot(vectorstore):
#     llm = ChatGoogleGenerativeAI(
#     model="models/gemini-1.5-pro",
#     temperature=0
# )


#     retriever = vectorstore.as_retriever()

#     prompt = ChatPromptTemplate.from_template(
#         """
#         Answer the question strictly using the following context.
#         If the answer is not present, say "I don't have enough data."

#         Context:
#         {context}

#         Question:
#         {question}
#         """
#     )

#     rag_chain = (
#         {
#             "context": retriever,
#             "question": RunnablePassthrough()
#         }
#         | prompt
#         | llm
#         | StrOutputParser()
#     )

#     return rag_chain
# """


from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


def create_chatbot(vectorstore):
    llm = ChatOpenAI(
        model="gpt-3.5-turbo",
        temperature=0
    )

    retriever = vectorstore.as_retriever()

    prompt = ChatPromptTemplate.from_template(
        """
        Answer the question strictly using the following context.
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
