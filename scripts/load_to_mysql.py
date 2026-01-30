import pandas as pd
from sqlalchemy import create_engine, text
from pathlib import Path
from urllib.parse import quote

BASE_DIR = Path(__file__).resolve().parent.parent
CLEAN_FILE = BASE_DIR / "clean" / "placements_clean.csv"
 
# Database configuration
db_user = "root"
db_password = "RuchaChavan@21"
db_host = "localhost"
db_name = "placements_db"

# URL-encode the password to handle special characters
encoded_password = quote(db_password, safe='')

# Create connection to MySQL server (without specifying database)
engine_base = create_engine(f'mysql+pymysql://{db_user}:{encoded_password}@{db_host}/')

# Create database if it doesn't exist 
with engine_base.connect() as conn:
    conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
    conn.commit()

# Connect to the specific database
engine = create_engine(f'mysql+pymysql://{db_user}:{encoded_password}@{db_host}/{db_name}')

df = pd.read_csv(CLEAN_FILE)

print(f"Loaded {len(df)} rows from CSV")

df.to_sql(
    name='placements',
    con=engine,
    if_exists='append',
    index=False
)

print("Data inserted successfully into the MySQL database.")
print(f"Total rows inserted: {len(df)}")