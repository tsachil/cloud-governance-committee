from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import engine, create_db_and_tables, get_session
from models import CloudService, CloudServiceCreate, CloudServiceRead, CloudServiceUpdate

app = FastAPI(title="Cloud Governance Committee API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Cloud Governance Committee API is running"}

@app.post("/services/", response_model=CloudServiceRead)
def create_service(service: CloudServiceCreate, session: Session = Depends(get_session)):
    db_service = CloudService.from_orm(service)
    session.add(db_service)
    session.commit()
    session.refresh(db_service)
    return db_service

@app.get("/services/", response_model=List[CloudServiceRead])
def read_services(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
    search: Optional[str] = None,
    session: Session = Depends(get_session),
):
    statement = select(CloudService)
    if search:
        statement = statement.where(CloudService.name.contains(search) | CloudService.provider.contains(search))
    statement = statement.offset(offset).limit(limit)
    services = session.exec(statement).all()
    return services

@app.get("/services/{service_id}", response_model=CloudServiceRead)
def read_service(service_id: int, session: Session = Depends(get_session)):
    service = session.get(CloudService, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.patch("/services/{service_id}", response_model=CloudServiceRead)
def update_service(
    service_id: int, service: CloudServiceUpdate, session: Session = Depends(get_session)
):
    db_service = session.get(CloudService, service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    service_data = service.dict(exclude_unset=True)
    for key, value in service_data.items():
        setattr(db_service, key, value)
    session.add(db_service)
    session.commit()
    session.refresh(db_service)
    return db_service

@app.delete("/services/{service_id}")
def delete_service(service_id: int, session: Session = Depends(get_session)):
    service = session.get(CloudService, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    session.delete(service)
    session.commit()
    return {"ok": True}