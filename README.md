# Spring Habit Tracker

## Description
A full-stack habit tracking application built with React (Vite), FastAPI, and Supabase. Users can create accounts, define personal intentions, and track daily completion using a simple rating system. The app also includes challenge-based goals with rewards to encourage consistency and habit formation.

## Features
- Custom JWT-based authentication (1-hour expiry tokens)
- Create and manage personal intentions (habits)
- Daily tracking system:
  - Completed
  - Partial completion
  - Not completed
- Habit challenges (e.g. complete an intention for 7 consecutive days)
- Unlock selectable trophies for completed challenges
- Progress tracking over time
- FastAPI backend with Supabase database integration


## Tech Stack
### Frontend
React (with Vite)
JavaScript (ES6+)
CSS
### Backend
Python
FastAPI
JWT authentication (custom implementation)

### Database
Supabase (PostgreSQL database only)

## How It Works
User signs up or logs in
User creates intentions (habits they want to track to which they can add notes)
Each day, the user logs progress using:
Star (complete)
Half star (partial)
Pass (given exception)
Unchecked (not done)
Users can attach challenges to intentions
Completing challenges unlocks trophies

## Authentication

Authentication is implemented using custom JWT tokens:

Tokens are issued at login
Stored client-side
Expire after 1 hour
Required for all protected routes

## Installation
Clone the repository
https://github.com/simonholt256/GreekMyth

### Backend Setup (FastAPI)
Navigate to the backend folder:
```
cd backend
```
Create a virtual environment:
```
python -m venv venv
```
Activate it:___
Mac/Linux:
```
source venv/bin/activate
```
Windows:
```
venv\Scripts\activate
```
Install dependencies:
```
pip install -r requirements.txt
```

Run the server:
```
python -m uvicorn main:app

```
### Frontend Setup (React)
Open a new terminal and navigate to frontend:
```
cd frontend
```
navigate to spring:
```
cd spring
```
Install dependencies:
```
npm install
```
Start the development server:
```
npm run dev
```
Open:
http://localhost:5173


## Demo
(Add screenshots and videos here)

## Future Improvements
- Mobile app version
- Push notifications
- A section with a stop watch and timer to time tasks
- A to do list section

