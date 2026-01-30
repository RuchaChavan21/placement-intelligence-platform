import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_FILE = BASE_DIR / "data" / "raw" / "placements_2025.csv"
CLEAN_FILE = BASE_DIR / "clean" / "placements_clean.csv"

# Load CSV without header to detect it manually
df = pd.read_csv(RAW_FILE, header=None)
df = df.dropna(how="all").reset_index(drop=True)

# ---------------- HEADER DETECTION ----------------
header_row_index = None
for i in range(len(df)):
    row_text = " ".join(df.iloc[i].astype(str))
    if "STUDENT" in row_text.upper() and "BRANCH" in row_text.upper():
        header_row_index = i
        break

if header_row_index is None:
    raise Exception("Header row not found. Check CSV format.")

df.columns = df.iloc[header_row_index]
df = df.iloc[header_row_index + 1:].reset_index(drop=True)

# Fix unnamed package column
df.columns = [f"col_{i}" if pd.isna(col) else col for i, col in enumerate(df.columns)]

# ---------------- NORMALIZE COLUMNS ----------------
df.columns = df.columns.astype(str).str.strip().str.upper()

column_map = {}
for col in df.columns:
    col_str = str(col).upper().strip()
    if "STUDENT" in col_str or "NAME" in col_str:
        column_map[col] = "student_name"
    elif "BRANCH" in col_str:
        column_map[col] = "branch"
    elif "RECRUITER" in col_str or "COMPANY" in col_str:
        column_map[col] = "company"
    elif "PACKAGE" in col_str or "LAKH" in col_str or col_str.startswith("COL_"):
        column_map[col] = "package_lpa"
    elif "NO" in col_str or "SR" in col_str or col_str == "S.NO":
        column_map[col] = "sno"

df = df.rename(columns=column_map)

# ---------------- VALIDATION ----------------
required_cols = ["student_name", "branch", "company", "package_lpa"]
missing = [c for c in required_cols if c not in df.columns]
if missing:
    raise Exception(f"Missing columns: {missing}")

# ---------------- CLEAN DATA ----------------
df["package_lpa"] = pd.to_numeric(df["package_lpa"], errors="coerce")

df = df[df["student_name"].notna()]
df = df[df["branch"].notna()]
df = df[df["company"].notna()]

df["student_name"] = df["student_name"].str.strip()
df["branch"] = df["branch"].str.strip()
df["company"] = df["company"].str.strip()

# YEAR TAG 
df["academic_year"] = "2025"

# ---------------- SAVE ----------------
CLEAN_FILE.parent.mkdir(exist_ok=True)
df.to_csv(CLEAN_FILE, index=False)

print("2025 placement data cleaned successfully")
print(f"Rows saved: {len(df)}")
print("Columns:", list(df.columns))
