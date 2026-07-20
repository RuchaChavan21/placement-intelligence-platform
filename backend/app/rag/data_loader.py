from sqlalchemy.orm import Session
from app.models import Placement

def load_placement_documents(db: Session):
    documents = []

    placements = db.query(Placement).all()

    # Transformed structured database rows into natural language documents for semantic retrieval

    for p in placements:
        text = (
            f"Student from {p.branch} branch was placed in {p.company} "
            f"with a package of {p.package_lpa} LPA in academic year {p.academic_year}."
        )
        documents.append(text)

    return documents
