from fastapi import FastAPI
from app.analytics import router as analytics_router

app = FastAPI(title="Campus Placement Analytics")

app.include_router(analytics_router, prefix="/api/analytics")

@app.get("/")
def health():
    return {"status": "Placement Analytics API running"}
