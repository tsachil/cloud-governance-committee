import pytest
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

def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Cloud Governance Committee API is running"}

def test_create_service(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "name": "Test Service",
            "provider": "AWS",
            "category": "Compute",
            "cost": 100.0,
            "owner": "Test Team",
            "status": "Active"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Service"
    assert data["id"] is not None

def test_read_services(client: TestClient):
    client.post(
        "/services/",
        json={
            "name": "Service 1",
            "provider": "AWS",
            "category": "Compute",
            "cost": 50.0,
            "owner": "Team A"
        },
    )
    response = client.get("/services/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_update_service(client: TestClient):
    # Create
    create_res = client.post(
        "/services/",
        json={
            "name": "Update Me",
            "provider": "GCP",
            "category": "Storage",
            "cost": 20.0,
            "owner": "Team B"
        },
    )
    service_id = create_res.json()["id"]

    # Update
    response = client.patch(
        f"/services/{service_id}",
        json={"cost": 25.0, "status": "Deprecated"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["cost"] == 25.0
    assert data["status"] == "Deprecated"

def test_delete_service(client: TestClient):
    # Create
    create_res = client.post(
        "/services/",
        json={
            "name": "Delete Me",
            "provider": "Azure",
            "category": "Database",
            "cost": 200.0,
            "owner": "Team C"
        },
    )
    service_id = create_res.json()["id"]

    # Delete
    response = client.delete(f"/services/{service_id}")
    assert response.status_code == 200
    
    # Verify
    get_res = client.get(f"/services/{service_id}")
    assert get_res.status_code == 404
