import sys
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")

from app.db import engine  # noqa: E402

df = pd.read_sql('SELECT * FROM placements LIMIT 5', engine)
print("First 5 rows:")
print(df)

result = pd.read_sql('SELECT COUNT(*) as cnt FROM placements', engine)
print(f'\nTotal rows in database: {result["cnt"][0]}')
