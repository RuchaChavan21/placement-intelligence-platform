import re
from sqlalchemy import func, desc
from app.db import SessionLocal
from app.models import Placement

def get_sql_analytics(query: str) -> str:
    db = SessionLocal()
    q = query.lower()
    
    year_match = re.search(r'20\d{2}', q)
    year = int(year_match.group(0)) if year_match else None

    def apply_year(query_obj):
        if year:
            return query_obj.filter(Placement.academic_year == year)
        return query_obj

    try:
        if "branch" in q and ("highest" in q or "most" in q or "more" in q or "top" in q):
            result = apply_year(db.query(Placement.branch, func.count(Placement.id).label('total'))).group_by(Placement.branch).order_by(desc('total')).first()
            if result:
                yr_str = f" in {year}" if year else ""
                return f"The branch with the highest placements{yr_str} is {result[0]} with {result[1]} students placed."
                
        if "highest" in q and ("package" in q or "placement" in q or "salary" in q or "offer" in q):
            result = apply_year(db.query(func.max(Placement.package_lpa))).scalar()
            yr_str = f" in {year}" if year else ""
            return f"The highest package offered{yr_str} is {result} LPA."
            
        if "average" in q and ("package" in q or "placement" in q or "salary" in q):
            result = apply_year(db.query(func.avg(Placement.package_lpa))).scalar()
            if result:
                yr_str = f" in {year}" if year else ""
                return f"The average package{yr_str} is {round(result, 2)} LPA."
                
        if "top" in q and ("recruiter" in q or "compan" in q):
            results = apply_year(db.query(Placement.company, func.count(Placement.id).label('total'))).group_by(Placement.company).order_by(desc('total')).limit(5).all()
            companies = ", ".join([f"{c[0]} ({c[1]} hires)" for c in results])
            yr_str = f" in {year}" if year else ""
            return f"The top recruiters{yr_str} are: {companies}."
            
        # Fallback query if specific logic didn't match perfectly, but it was routed here.
        total_students = apply_year(db.query(func.count(Placement.id))).scalar()
        avg_pkg = apply_year(db.query(func.avg(Placement.package_lpa))).scalar()
        yr_str = f" in {year}" if year else ""
        return f"General Stats{yr_str}: Total students placed are {total_students}. The overall average package is {round(avg_pkg, 2) if avg_pkg else 0} LPA."
    finally:
        db.close()
