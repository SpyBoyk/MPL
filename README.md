# Malghar Premier League (MPL)

Full-stack cricket tournament management website.

## Tech Stack
- **Backend**: Django 5.2 + Django REST Framework + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # Edit with your DB credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_sample_data  # Optional sample data
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Database Setup
Create a PostgreSQL database named `mpl_db` and update `.env` accordingly.

## Running Tests
```bash
# Backend
cd backend && python manage.py test

# Frontend
cd frontend && npm test
```
