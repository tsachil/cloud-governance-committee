from typing import Optional
from sqlmodel import Field, SQLModel

class CloudServiceBase(SQLModel):
    name: str = Field(index=True)
    description: str = Field(default="")
    provider: str
    provider_description: str = Field(default="")
    participants: str = Field(default="")
    
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
    participants: Optional[str] = None
    q_failure: Optional[int] = None
    q_data_leakage: Optional[int] = None
    q_legal: Optional[int] = None
    q_vendor: Optional[int] = None
    q_disconnection: Optional[int] = None