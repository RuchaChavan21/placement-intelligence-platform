"""
Load the cleaned placements CSV into the database pointed to by DATABASE_URL
(Neon Postgres in production, MySQL/sqlite locally).

Usage (from the backend/ folder):
    DATABASE_URL="postgresql://..." python scripts/load_to_mysql.py

Re-running replaces the existing rows, so it is safe to run more than once.
"""
import sys
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")

from app.db import Base, engine, DATABASE_URL  # noqa: E402
from app.models import Placement  # noqa: E402

CLEAN_FILE = BASE_DIR / "clean" / "placements_clean.csv"

print(f"Target database: {engine.url.render_as_string(hide_password=True)}")

# Create the placements table (with its auto-increment id) from the ORM model
Base.metadata.create_all(engine)

df = pd.read_csv(CLEAN_FILE)
print(f"Loaded {len(df)} rows from CSV")

with engine.begin() as conn:
    conn.execute(Placement.__table__.delete())
    df.to_sql(name="placements", con=conn, if_exists="append", index=False)

print("Data inserted successfully into the database.")
print(f"Total rows inserted: {len(df)}")
