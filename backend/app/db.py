import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger(__name__)


def get_database_url() -> str:
    """
    Read DATABASE_URL from the environment (set it in .env locally, or in the
    Render dashboard in production). Falls back to a local sqlite file.
    """
    url = os.getenv("DATABASE_URL")
    if not url:
        logger.warning("DATABASE_URL not set. Falling back to sqlite dev DB.")
        return "sqlite:///./dev.db"

    # some providers hand out postgres:// which SQLAlchemy no longer accepts
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    return url


DATABASE_URL = get_database_url()

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# use pool_pre_ping to avoid stale connection errors (Neon closes idle connections)
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
