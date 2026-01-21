#!/bin/bash
set -e

echo "Running Backend Tests..."
PYTHONPATH=backend backend/venv/bin/python -m pytest backend/tests

echo "Running Frontend Tests..."
cd frontend
npm run test
