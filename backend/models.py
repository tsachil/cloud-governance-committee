from typing import Optional
from datetime import date, datetime
from sqlmodel import Field, SQLModel

class CloudServiceBase(SQLModel):
    name: str = Field(index=True)
    description: str = Field(default="")
    provider: str  # Free text
    provider_description: str = Field(default="")
    
    # Representatives
    representative_cto: str = Field(default="")
    representative_security: str = Field(default="")
    representative_infra: str = Field(default="")
    representative_risk: str = Field(default="")
    representative_other: str = Field(default="")
    
    # Date
    service_date: date = Field(default_factory=date.today)

    # Risk Assessment Questions
    q_failure: int = Field(default=0, description="Impact of failure (0-30)")
    q_data_leakage: int = Field(default=0, description="Impact of data leakage (0-30)")
    q_legal: int = Field(default=0, description="Impact of legal or regulation (0-15)")
    q_vendor: int = Field(default=0, description="Impact of vendor cloudability (0-15)")
    q_disconnection: int = Field(default=0, description="Impact of disconnections (0-10)")
    
    # Calculated Fields
    total_score: int = Field(default=0)
    impact_level: str = Field(default="Minimal")

class CloudService(CloudServiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CloudServiceCreate(CloudServiceBase):
    pass

class CloudServiceRead(CloudServiceBase):
    id: int

class CloudServiceUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[str] = None
    provider_description: Optional[str] = None
    
    representative_cto: Optional[str] = None
    representative_security: Optional[str] = None
    representative_infra: Optional[str] = None
    representative_risk: Optional[str] = None
    representative_other: Optional[str] = None
    
    service_date: Optional[date] = None

    q_failure: Optional[int] = None
    q_data_leakage: Optional[int] = None
    q_legal: Optional[int] = None
    q_vendor: Optional[int] = None
    q_disconnection: Optional[int] = None
