from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

@router.get("/stock-status", response_model=list[schemas.StokDurumu])
def get_stock_status(db: Session = Depends(get_db)):
    return crud.get_stok_durumu(db)
