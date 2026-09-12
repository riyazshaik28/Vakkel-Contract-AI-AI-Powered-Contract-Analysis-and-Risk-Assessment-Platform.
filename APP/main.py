from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from  APP.database import init_db
from APP.routes.contracts import router
from  APP.routes.analysis import router as p
app=FastAPI(
    title="Vakeel Contract AI",
    description="This is a simple API for the Vakeel Contract AI project.",

    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(p)

@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
def root():
    return {
        "message": "Welcome to the Vakeel Contract AI API!",
        "endpoints": {
            "POST /contracts/upload": "Upload a contract PDF",
            "GET /contracts/{id}": "Get contract details by ID",
            "POST /contracts/{id}/analyze": "Analyze a contract by ID",
            "GET /contracts/{id}/analysis": "Get analysis results for a contract"
        }
    }