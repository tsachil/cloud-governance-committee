import pytest
from datetime import date
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app, get_session
from models import CloudService

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_create_service_with_new_fields(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "name": "New Fields App",
            "provider": "Custom Provider",
            "service_date": "2023-10-27",
            "representative_cto": "Alice",
            "representative_security": "Bob",
            "q_failure": 30
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "Custom Provider"
    assert data["service_date"] == "2023-10-27"
    assert data["representative_cto"] == "Alice"
    assert data["representative_security"] == "Bob"
    # Check default calc logic still works
    assert data["total_score"] == 30
    assert data["impact_level"] == "Minimal"

def test_create_service_default_date(client: TestClient):
    # If date is omitted, it should default to today (handled by model or frontend, 
    # but strictly speaking backend model has default_factory=datetime.now)
    # However, Pydantic/SQLModel models with default_factory might need the field to be excluded from input to trigger.
    # Our API expects a CloudServiceCreate object.
    
    response = client.post(
        "/services/",
        json={
            "name": "Default Date App",
            "provider": "AWS"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["service_date"] == str(date.today())

def test_update_representatives(client: TestClient):
    # Create
    create_res = client.post(
        "/services/",
        json={"name": "Rep Test", "provider": "Azure"}
    )
    service_id = create_res.json()["id"]

    # Update reps
    response = client.patch(
        f"/services/{service_id}",
        json={
            "representative_infra": "Charlie",
            "representative_risk": "Dana"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["representative_infra"] == "Charlie"
    assert data["representative_risk"] == "Dana"