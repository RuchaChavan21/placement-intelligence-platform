from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings


def build_vector_store(texts: list[str]):
    """
    Builds FAISS vector store using local HuggingFace embeddings
    (NO external API, NO quota).
    """

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    return FAISS.from_texts(texts, embeddings)
