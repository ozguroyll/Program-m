from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routers import stock, accounting, cash, bank, exchange, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stock Management System",
    description="Comprehensive stock management system for grain trading business",
    version="1.0.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(stock.router)
app.include_router(accounting.router)
app.include_router(cash.router)
app.include_router(bank.router)
app.include_router(exchange.router)
app.include_router(dashboard.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Stock Management System API", "version": "1.0.0"}
