from fastapi import FastAPI
from fastapi.responses import Response
from app.analytics import router as analytics_router

app = FastAPI(title="Campus Placement Analytics")

app.include_router(analytics_router, prefix="/api/analytics")


@app.get("/favicon.ico", include_in_schema=False)
def favicon() -> Response:
    svg = (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>"
        "<rect width='16' height='16' fill='#1f2937'/>"
        "<text x='8' y='11' font-size='10' text-anchor='middle' fill='white'>P</text>"
        "</svg>"
    )
    return Response(content=svg, media_type="image/svg+xml")


@app.get("/")
def health():
    return {"status": "Placement Analytics API running"}
