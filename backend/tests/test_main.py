from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
import pytest
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

def test_create_service(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "system_name": "Test Project",
            "applicant": "Alice",
            "total_score": 10
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["system_name"] == "Test Project"
    assert data["applicant"] == "Alice"
    assert data["total_score"] == 10
    assert "id" in data

def test_read_services(client: TestClient):
    client.post(
        "/services/",
        json={"system_name": "Service 1", "applicant": "Bob"}
    )
    client.post(
        "/services/",
        json={"system_name": "Service 2", "applicant": "Charlie"}
    )
    
    response = client.get("/services/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["system_name"] == "Service 1"

def test_update_service(client: TestClient):
    # Create
    create_resp = client.post(
        "/services/",
        json={"system_name": "Old Name", "total_score": 20}
    )
    service_id = create_resp.json()["id"]
    
    # Update
    response = client.patch(
        f"/services/{service_id}",
        json={"system_name": "New Name", "total_score": 80}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["system_name"] == "New Name"
    assert data["total_score"] == 80

def test_delete_service(client: TestClient):
    create_resp = client.post(
        "/services/",
        json={"system_name": "To Delete"}
    )
    service_id = create_resp.json()["id"]
    
    del_resp = client.delete(f"/services/{service_id}")
    assert del_resp.status_code == 200
    
    get_resp = client.get(f"/services/{service_id}")
    assert get_resp.status_code == 404
