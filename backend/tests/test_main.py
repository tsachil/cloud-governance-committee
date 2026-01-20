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

def test_create_service_high_impact(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "name": "High Impact App",
            "provider": "AWS",
            "q_failure": 30,
            "q_data_leakage": 30,
            "q_legal": 15,
            "q_vendor": 0,
            "q_disconnection": 0,
            "participants": "Team A, Team B",
            "description": "Critical system"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 75
    assert data["impact_level"] == "High"
    assert data["participants"] == "Team A, Team B"
    assert data["description"] == "Critical system"

def test_create_service_medium_impact(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "name": "Medium Impact App",
            "provider": "GCP",
            "q_failure": 20,
            "q_data_leakage": 20,
            "q_legal": 10,
            "q_vendor": 0,
            "q_disconnection": 0
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 50
    assert data["impact_level"] == "Medium"

def test_create_service_minimal_impact(client: TestClient):
    response = client.post(
        "/services/",
        json={
            "name": "Low Impact App",
            "provider": "Azure",
            "q_failure": 10,
            "q_data_leakage": 10,
            "q_legal": 0,
            "q_vendor": 0,
            "q_disconnection": 0
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 20
    assert data["impact_level"] == "Minimal"

def test_update_service_recalculates_score(client: TestClient):
    # Create minimal
    create_res = client.post(
        "/services/",
        json={
            "name": "Update Test",
            "provider": "Azure",
            "q_failure": 10
        },
    )
    service_id = create_res.json()["id"]
    
    # Update to high
    response = client.patch(
        f"/services/{service_id}",
        json={"q_data_leakage": 30, "q_legal": 15, "q_failure": 30}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_score"] == 75 # 30 + 30 + 15
    assert data["impact_level"] == "High"
