from fastapi import APIRouter, Depends, Query
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


# Data for company-wise placement chart

@router.get("/charts/company-wise")
def company_wise_chart(
    year: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            Placement.company,
            func.count(Placement.id).label("offers")
        )
    )

    if year:
        query = query.filter(Placement.academic_year == year)

    result = (
        query.group_by(Placement.company)
        .order_by(func.count(Placement.id).desc())
        .all()
    )

    return {
        "labels": [r.company for r in result],
        "values": [r.offers for r in result]
    }


# Data for branch-wise average package chart

@router.get("/charts/branch-average-package")
def branch_avg_package_chart(
    year: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            Placement.branch,
            func.avg(Placement.package_lpa).label("avg_package")
        )
    )

    if year:
        query = query.filter(Placement.academic_year == year)

    result = query.group_by(Placement.branch).all()

    return {
        "labels": [r.branch for r in result],
        "values": [round(float(r.avg_package), 2) for r in result]
    }

# Data for top N companies chart

@router.get("/charts/top-companies")
def top_companies_chart(
    n: int = Query(5, ge=1, le=20),
    year: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            Placement.company,
            func.count(Placement.id).label("offers")
        )
    )

    if year:
        query = query.filter(Placement.academic_year == year)

    result = (
        query.group_by(Placement.company)
        .order_by(func.count(Placement.id).desc())
        .limit(n)
        .all()
    )

    return {
        "labels": [r.company for r in result],
        "values": [r.offers for r in result]
    }


# Data for package distribution chart
@router.get("/charts/package-distribution")
def package_distribution_chart(
    year: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Placement.package_lpa)

    if year:
        query = query.filter(Placement.academic_year == year)

    packages = [float(r[0]) for r in query.all() if r[0] is not None]

    bins = {
        "0–3": 0,
        "3–6": 0,
        "6–10": 0,
        "10+": 0
    }

    for p in packages:
        if p < 3:
            bins["0–3"] += 1
        elif p < 6:
            bins["3–6"] += 1
        elif p < 10:
            bins["6–10"] += 1
        else:
            bins["10+"] += 1

    return {
        "labels": list(bins.keys()),
        "values": list(bins.values())
    }
