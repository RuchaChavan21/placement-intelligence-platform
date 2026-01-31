from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import SessionLocal
from app.models import Placement

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# used GROUP BY with aggregation to compute company-wise placement counts


@router.get("/company-wise")
def company_wise_placements(db: Session = Depends(get_db)):
    result = (
        db.query(
            Placement.company,
            func.count(Placement.id).label("offers")
        )
        .group_by(Placement.company)
        .order_by(func.count(Placement.id).desc())
        .all()
    )

    return [
        {"company": r.company, "offers": r.offers}
        for r in result
    ]


# AVG aggregation to calculate branch-wise average salary.
@router.get("/branch-average-package")
def branch_avg_package(db: Session = Depends(get_db)):
    result = (
        db.query(
            Placement.branch,
            func.avg(Placement.package_lpa).label("avg_package")
        )
        .group_by(Placement.branch)
        .all()
    )

    return [
        {
            "branch": r.branch,
            "average_package_lpa": round(float(r.avg_package), 2)
        }
        for r in result
    ]

# summary analytics using SQL aggregation functions like COUNT, MAX, and AVG

@router.get("/summary")
def placement_summary(db: Session = Depends(get_db)):
    total_offers = db.query(func.count(Placement.id)).scalar() or 0
    max_package = db.query(func.max(Placement.package_lpa)).scalar() or 0.0
    avg_package = db.query(func.avg(Placement.package_lpa)).scalar() or 0.0

    return {
        "total_offers": int(total_offers),
        "highest_package_lpa": float(max_package),
        "average_package_lpa": round(float(avg_package), 2),
    }

# Filtered company-wise placements by academic year
@router.get("/company-wise/{year}")
def company_wise_by_year(year: str, db: Session = Depends(get_db)):
    result = (
        db.query(
            Placement.company,
            func.count(Placement.id).label("offers")
        )
        .filter(Placement.academic_year == year)
        .group_by(Placement.company)
        .order_by(func.count(Placement.id).desc())
        .all()
    )

    return [
        {"company": r.company, "offers": r.offers}
        for r in result
    ]

