# Cloud Governance Committee - Frontend

This directory contains the frontend user interface for the Cloud Governance Committee application. It is a Single Page Application (SPA) built to allow easy management and risk assessment of cloud services.

## Technologies
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Typed superset of JavaScript.
- **Vite:** Next Generation Frontend Tooling (fast build tool).
- **Bootstrap (via React-Bootstrap):** Styling framework for responsive design.
- **Axios:** Promise based HTTP client for the browser.
- **Vitest:** Testing framework.

## Setup & Running locally

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Features
- **Dashboard:** Displays a table of all registered cloud services with key metrics.
- **Add/Edit Modal:** A comprehensive form to input service details, assign representatives, and answer risk assessment questions.
- **Real-time Risk Calculation:** Automatically calculates total risk score and assigns an impact level (Minimal, Medium, High) based on questionnaire answers.
- **Search:** Filter services by name or provider.

## Testing
To run the unit tests:
```bash
npm run test
```