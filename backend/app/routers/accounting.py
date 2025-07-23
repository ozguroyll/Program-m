from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/accounting", tags=["accounting"])

@router.get("/current-accounts", response_model=List[schemas.CariKayit])
def get_current_accounts(skip: int = 0, limit: int = 100, cari_ad: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_cari_kayitlari(db, skip=skip, limit=limit, cari_ad=cari_ad)

@router.post("/current-accounts", response_model=schemas.CariKayit)
def create_current_account_entry(entry: schemas.CariKayitCreate, db: Session = Depends(get_db)):
    return crud.create_cari_kayit(db, cari=entry)

@router.get("/current-accounts/balance/{cari_ad}")
def get_account_balance(cari_ad: str, db: Session = Depends(get_db)):
    return crud.get_cari_bakiye(db, cari_ad=cari_ad)

@router.get("/income", response_model=List[schemas.GelirKaydi])
def get_income_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_gelir_kayitlari(db, skip=skip, limit=limit)

@router.post("/income", response_model=schemas.GelirKaydi)
def create_income_record(income: schemas.GelirKaydiCreate, db: Session = Depends(get_db)):
    return crud.create_gelir_kaydi(db, gelir=income)

@router.get("/expense", response_model=List[schemas.GiderKaydi])
def get_expense_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_gider_kayitlari(db, skip=skip, limit=limit)

@router.post("/expense", response_model=schemas.GiderKaydi)
def create_expense_record(expense: schemas.GiderKaydiCreate, db: Session = Depends(get_db)):
    return crud.create_gider_kaydi(db, gider=expense)
