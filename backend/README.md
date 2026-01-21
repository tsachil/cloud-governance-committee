# Cloud Governance Committee - Backend

This directory contains the backend API for the Cloud Governance Committee application. It provides endpoints to manage cloud service records, calculate risk scores, and store data using SQLite.

## Technologies
- **Python 3.9+**
- **FastAPI:** High-performance web framework for building APIs.
- **SQLModel:** Library for interacting with SQL databases using Python objects (combines SQLAlchemy and Pydantic).
- **SQLite:** Lightweight, serverless database engine (default storage).

## Setup & Running locally

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Interactive API documentation (Swagger UI) is at `http://localhost:8000/docs`.

## Key Files
- `main.py`: Entry point for the FastAPI application. Defines routes and startup logic.
- `models.py`: SQLModel definitions for the database tables and Pydantic schemas.
- `database.py`: Database connection and session management.
- `tests/`: Contains pytest test cases.

## API Endpoints
- `GET /services/`: List all services (supports pagination and search).
- `POST /services/`: Create a new cloud service record (automatically calculates risk score).
- `GET /services/{id}`: Retrieve details of a specific service.
- `PATCH /services/{id}`: Update a service (recalculates risk score).
- `DELETE /services/{id}`: Remove a service record.
