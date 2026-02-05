from sqlalchemy import func
from app.db import SessionLocal
from app.models import Placement


def get_total_records():
    db = SessionLocal()
    try:
        return db.query(func.count(Placement.id)).scalar()
    finally:
        db.close()
