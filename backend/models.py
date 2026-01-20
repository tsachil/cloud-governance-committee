from typing import Optional
from sqlmodel import Field, SQLModel

class CloudServiceBase(SQLModel):
    name: str = Field(index=True)
    provider: str
    category: str
    cost: float
    owner: str
    status: str = "Active"

class CloudService(CloudServiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CloudServiceCreate(CloudServiceBase):
    pass

class CloudServiceRead(CloudServiceBase):
    id: int

class CloudServiceUpdate(SQLModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    category: Optional[str] = None
    cost: Optional[float] = None
    owner: Optional[str] = None
    status: Optional[str] = None
