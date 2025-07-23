from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/stock", tags=["stock"])

@router.get("/products", response_model=List[schemas.Urun])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_urunler(db, skip=skip, limit=limit)

@router.post("/products", response_model=schemas.Urun)
def create_product(product: schemas.UrunCreate, db: Session = Depends(get_db)):
    return crud.create_urun(db, urun=product)

@router.get("/suppliers", response_model=List[schemas.Tedarikci])
def get_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tedarikciler(db, skip=skip, limit=limit)

@router.post("/suppliers", response_model=schemas.Tedarikci)
def create_supplier(supplier: schemas.TedarikciCreate, db: Session = Depends(get_db)):
    return crud.create_tedarikci(db, tedarikci=supplier)

@router.get("/customers", response_model=List[schemas.Musteri])
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_musteriler(db, skip=skip, limit=limit)

@router.post("/customers", response_model=schemas.Musteri)
def create_customer(customer: schemas.MusteriCreate, db: Session = Depends(get_db)):
    return crud.create_musteri(db, musteri=customer)

@router.get("/entries", response_model=List[schemas.StokKaydi])
def get_stock_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stok_kayitlari(db, skip=skip, limit=limit)

@router.post("/entries", response_model=schemas.StokKaydi)
def create_stock_entry(entry: schemas.StokKaydiCreate, db: Session = Depends(get_db)):
    return crud.create_stok_kaydi(db, stok=entry)

@router.get("/exits", response_model=List[schemas.StokCikis])
def get_stock_exits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stok_cikislari(db, skip=skip, limit=limit)

@router.post("/exits", response_model=schemas.StokCikis)
def create_stock_exit(exit: schemas.StokCikisCreate, db: Session = Depends(get_db)):
    return crud.create_stok_cikis(db, cikis=exit)

@router.get("/status", response_model=List[schemas.StokDurumu])
def get_stock_status(db: Session = Depends(get_db)):
    return crud.get_stok_durumu(db)
