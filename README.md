Event Tracker
=============

Author: Abhishek Kumar  
Email : abhishek1py@gmail.com  
Website: https://incredibleds.tech  

This project contains a Django REST Framework backend and a React frontend in a monorepo structure.

Project Structure:
------------------
event_tracker/
├── backend/     -> Django backend
└── frontend/    -> React frontend

Setup Instructions:
-------------------

1. Clone the Repository
-----------------------
git clone https://github.com/Developer-AD/event_tracker.git
cd event_tracker

2. Setup Backend (Django)
-------------------------
cd backend

# Create a virtual environment
python -m venv venv

# Activate the environment
venv\Scripts\activate        (On Windows)
# source venv/bin/activate   (On Linux/macOS)

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

3. Running Django Backend
-------------------------

Option A: Run on port 80 (default)
----------------------------------
sudo python manage.py runserver 0.0.0.0:80   (Requires admin privileges)

Option B: Run on port 8000 (recommended for development)
--------------------------------------------------------
python manage.py runserver 0.0.0.0:8000

NOTE: If using port 8000, update the frontend base URL.

Edit: frontend/src/services/api.js

For port 80:
------------
const baseUrl = 'http://localhost';

For port 8000:
--------------
const baseUrl = 'http://localhost:8000';

4. Test the Backend
-------------------
Open your browser and go to:
http://localhost/api/

Expected Response:
------------------
{ "message": "Welcome to Event Tracker home!" }

5. Setup Frontend (React)
-------------------------
Open a new terminal window:

cd frontend

# Install frontend dependencies
npm install

# Run the frontend dev server
npm run dev

Frontend will be available at:
http://localhost:3000

Final Notes:
------------
- Make sure the frontend baseUrl matches your backend port.
- Keep backend and frontend running in separate terminal windows.
- Always activate your Python virtual environment before backend work.

Thank you so much for vising my repository.