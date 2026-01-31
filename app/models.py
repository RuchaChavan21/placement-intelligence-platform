from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, Float
from sqlalchemy.sql import func
from app.db import Base

class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True, index=True)
    sno = Column(Integer)
    student_name = Column(String(255))
    branch = Column(String(100))
    company = Column(String(255))
    package_lpa = Column(Float)
    academic_year = Column(Integer)
