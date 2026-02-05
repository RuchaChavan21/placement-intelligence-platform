from sqlalchemy import func
from app.db import SessionLocal
from app.models import Placement


def build_placement_summary(year: str | None = None) -> str:
    db = SessionLocal()
    try:
        filters = []
        if year:
            filters.append(Placement.academic_year == year)

        total_students = (
            db.query(func.count(Placement.id))
            .filter(*filters)
            .scalar()
        )

        highest = (
            db.query(func.max(Placement.package_lpa))
            .filter(*filters)
            .scalar()
        )

        average = (
            db.query(func.avg(Placement.package_lpa))
            .filter(*filters)
            .scalar()
        )

        top_companies = (
            db.query(
                Placement.company,
                func.count(Placement.id).label("count")
            )
            .filter(*filters)
            .group_by(Placement.company)
            .order_by(func.count(Placement.id).desc())
            .limit(5)
            .all()
        )

        summary = f"""
Placement Summary {f'for {year}' if year else ''}

Total students placed: {total_students}
Highest package: {round(float(highest), 2)} LPA
Average package: {round(float(average), 2)} LPA

Top recruiting companies:
"""

        for c in top_companies:
            summary += f"- {c.company}: {c.count} students\n"

        return summary.strip()

    finally:
        db.close()

def get_all_academic_years():
    db = SessionLocal()
    try:
        years = (
            db.query(Placement.academic_year)
            .distinct()
            .all()
        )
        return [y[0] for y in years]
    finally:
        db.close()
