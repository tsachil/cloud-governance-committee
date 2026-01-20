# Cloud Governance Committee

A centralized web application to map and manage cloud service usage.

## Setup

### Backend
1. Navigate to `backend/`
2. Activate virtual environment: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Features
- **Map Services:** Enter details like name, provider, category, cost, and owner.
- **Service Inventory:** View all services in a clean table.
- **Search:** Search for services by name or provider.
- **Edit/Delete:** Keep your service mapping up to date.
- **API Docs:** Interactive documentation available at `http://localhost:8000/docs`
