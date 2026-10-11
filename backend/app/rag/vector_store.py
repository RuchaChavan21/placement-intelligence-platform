from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FastEmbedEmbeddings


def build_vector_store(texts: list[str]):
    """
    Builds FAISS vector store using local ONNX embeddings via FastEmbed
    (NO external API, NO quota, no PyTorch — fits in 512MB RAM).
    """

    embeddings = FastEmbedEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        # small batches + 1 thread keep peak RAM ~380MB (default ~560MB+)
        batch_size=32,
        threads=1,
    )

    return FAISS.from_texts(texts, embeddings)
