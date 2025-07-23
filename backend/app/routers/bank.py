from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/bank", tags=["bank"])

@router.get("/transactions", response_model=List[schemas.BankaIslem])
def get_bank_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_banka_islemleri(db, skip=skip, limit=limit)

@router.post("/transactions", response_model=schemas.BankaIslem)
def create_bank_transaction(transaction: schemas.BankaIslemCreate, db: Session = Depends(get_db)):
    return crud.create_banka_islem(db, banka=transaction)
