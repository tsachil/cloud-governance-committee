from fastapi import FastAPI, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from database import create_db_and_tables, get_session
from models import CloudService, CloudServiceCreate, CloudServiceRead, CloudServiceUpdate
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Cloud Governance Committee API"}

@app.post("/services/", response_model=CloudServiceRead)
def create_service(service: CloudServiceCreate, session: Session = Depends(get_session)):
    db_service = CloudService.model_validate(service)
    session.add(db_service)
    session.commit()
    session.refresh(db_service)
    return db_service

@app.get("/services/", response_model=List[CloudServiceRead])
def read_services(
    offset: int = 0,
    limit: int = 100,
    search: Optional[str] = "",
    session: Session = Depends(get_session)
):
    query = select(CloudService)
    if search:
        # Search in system_name or applicant
        query = query.where(
            (CloudService.system_name.contains(search)) | 
            (CloudService.applicant.contains(search))
        )
    query = query.offset(offset).limit(limit)
    services = session.exec(query).all()
    return services

@app.get("/services/{service_id}", response_model=CloudServiceRead)
def read_service(service_id: int, session: Session = Depends(get_session)):
    service = session.get(CloudService, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.patch("/services/{service_id}", response_model=CloudServiceRead)
def update_service(
    service_id: int,
    service: CloudServiceUpdate,
    session: Session = Depends(get_session)
):
    db_service = session.get(CloudService, service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service_data = service.model_dump(exclude_unset=True)
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
