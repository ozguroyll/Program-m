from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/cash", tags=["cash"])

@router.get("/transactions", response_model=List[schemas.KasaIslem])
def get_cash_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_kasa_islemleri(db, skip=skip, limit=limit)

@router.post("/transactions", response_model=schemas.KasaIslem)
def create_cash_transaction(transaction: schemas.KasaIslemCreate, db: Session = Depends(get_db)):
    return crud.create_kasa_islem(db, kasa=transaction)

@router.get("/balance/{currency}")
def get_cash_balance(currency: str, db: Session = Depends(get_db)):
    return crud.get_kasa_bakiye(db, doviz_tipi=currency)
