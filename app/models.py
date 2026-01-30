from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from app.db import Base

class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True)
    sno = Column(Integer)
    student_name = Column(String(100))
    branch = Column(String(50))
    company = Column(String(100))
    package_lpa = Column(DECIMAL(5,2))
    academic_year = Column(String(10))
    created_at = Column(TIMESTAMP, server_default=func.now())
