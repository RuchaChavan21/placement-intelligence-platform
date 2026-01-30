import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote

db_user = 'root'
db_password = 'RuchaChavan@21'
db_host = 'localhost'
db_name = 'placements_db'

encoded_password = quote(db_password, safe='')
engine = create_engine(f'mysql+pymysql://{db_user}:{encoded_password}@{db_host}/{db_name}')

df = pd.read_sql('SELECT * FROM placements LIMIT 5', engine)
print("First 5 rows:")
print(df)

result = pd.read_sql('SELECT COUNT(*) as cnt FROM placements', engine)
print(f'\nTotal rows in database: {result["cnt"][0]}')
