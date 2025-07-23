from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/exchange", tags=["exchange"])

@router.get("/rates", response_model=List[schemas.DovizKuru])
def get_exchange_rates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_doviz_kurları(db, skip=skip, limit=limit)

@router.post("/rates", response_model=schemas.DovizKuru)
def create_exchange_rate(rate: schemas.DovizKuruCreate, db: Session = Depends(get_db)):
    return crud.create_doviz_kuru(db, kur=rate)

@router.get("/rates/{currency}")
def get_current_rate(currency: str, db: Session = Depends(get_db)):
    rate = crud.get_guncel_kur(db, doviz_kodu=currency)
    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    return rate
