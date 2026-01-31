# ...existing code...
import os
import logging
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger(__name__)

# prefer env var; keep your encoded password here if not using env
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:RuchaChavan%4021@localhost:3306/placements_db"
)

# detect malformed MySQL URL (unencoded '@' in password becomes part of host)
parsed = urlparse(DATABASE_URL)
if parsed.scheme.startswith("mysql") and parsed.hostname is None:
    logger.warning("DATABASE_URL appears malformed (%s). Falling back to sqlite dev DB.", DATABASE_URL)
    DATABASE_URL = "sqlite:///./dev.db"

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# use pool_pre_ping to avoid stale connection errors
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
# ...existing code...
