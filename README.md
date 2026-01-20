# Cloud Governance Committee

A centralized web application to map, manage, and risk-assess cloud service usage.

## Features
- **Service Inventory:** View all cloud services with ownership and risk details.
- **Risk Assessment:** Built-in questionnaire to calculate risk scores (0-100) and impact levels (Minimal, Medium, High).
- **Detailed Tracking:** Store descriptions for services, providers, and participants.
- **Search:** Quickly find services by name or provider.

## Technology Stack
- **Frontend:** React, TypeScript, Bootstrap, Vite
- **Backend:** Python, FastAPI, SQLModel (SQLite)
- **Containerization:** Docker & Docker Compose

## Setup

### Using Docker (Recommended)
1. Ensure Docker is running.
2. Start the application:
   ```bash
   docker-compose up -d --build
   ```
3. Access the application:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Local Development
**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Testing
Run the regression test suite to verify both frontend and backend:
```bash
./run_tests.sh
```