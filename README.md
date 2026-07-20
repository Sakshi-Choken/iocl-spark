# 🔥 IOCL Spark – Employee Engagement Portal

A full-stack gamified employee engagement platform built for IOCL Panipat Refinery, designed to boost employee morale and team bonding through interactive games, rewards, and real-time engagement features.

🔗 **Live Demo:** [iocl-spark.vercel.app](https://iocl-spark.vercel.app)

## 🚀 Features

- **Authentication & Authorization** — Secure JWT-based login/register with role-based access control (Employee/Admin)
- **Gamification System** — Earn coins and XP by playing games, with automatic level progression
- **9 Interactive Games** — Tic Tac Toe (with AI opponent), Quiz Challenge, Reaction Test, Spin Wheel, Memory Match, Speed Typing Test, Flappy Bird, Emoji Guess, Simon Says
- **Real-time Leaderboard** — Ranks employees by coins earned, with medal highlights for top performers
- **Badges & Achievements** — Automatically unlocked based on milestones (coins earned, games played, level reached)
- **Admin Dashboard** — Manage employees (view/delete), broadcast announcements, and monitor employee login activity
- **Login Activity Tracking** — Admin-only visibility into employee login history (timestamps and IP addresses)
- **Announcements** — Admins can post updates that all employees see on their dashboard
- **Responsive UI** — Custom IOCL-branded design (navy & red theme) built with Bootstrap 5
- **Live Deployment** — Fully deployed and publicly accessible (frontend on Vercel, backend on Render)

## 🎮 Games Overview


|
 Game 
|
 Description 
|
|
------
|
-------------
|
|
 Tic Tac Toe 
|
 Classic game with a minimax-based AI opponent 
|
|
 Quiz Challenge 
|
 Random brain-teaser questions from a rotating question bank 
|
|
 Reaction Test 
|
 Best-of-3 rounds testing reflexes with multi-color distractors 
|
|
 Spin Wheel 
|
 Fun office-appropriate dares with coin rewards 
|
|
 Memory Match 
|
 Card-matching game scored by moves and time 
|
|
 Speed Typing Test 
|
 WPM and accuracy-based typing challenge 
|
|
 Flappy Bird 
|
 Classic arcade-style endless runner 
|
|
 Emoji Guess 
|
 Guess Bollywood/Hollywood movies and phrases from emoji clues 
|
|
 Simon Says 
|
 Color sequence memory challenge 
|

## 🛠️ Tech Stack

**Frontend:** React.js (Vite), React Router DOM, Axios, Bootstrap 5, Context API
**Backend:** Node.js, Express.js (MVC architecture)
**Database:** MongoDB Atlas, Mongoose
**Authentication:** JWT, bcrypt.js
**Deployment:** Vercel (Frontend), Render (Backend)
**Tools:** Postman, Git & GitHub, VS Code

## 📁 Project Structure

iocl-spark/
├── backend/
│ ├── config/ # Database connection
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth & role-based protection
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── utils/ # Helper functions (JWT, badges)
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI (Navbar)
│ │ ├── context/ # Auth state management
│ │ ├── games/ # 9 game components
│ │ ├── pages/ # Page-level components
│ │ └── services/ # Axios API config
└── README.md


## ⚙️ Setup Instructions

### Backend

cd backend
npm install

Create a `.env` file in the `backend` folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

Run the server:

npm run dev


### Frontend

cd frontend
npm install

Create a `.env` file in the `frontend` folder (optional, for connecting to a deployed backend):

VITE_API_URL=http://localhost:5000/api

Run the app:

npm run dev


The app will be available at `http://localhost:5173`, with the backend running on `http://localhost:5000`.

## 👩‍💻 Author

Sakshi Choken
Built as an internship project for IOCL Panipat Refinery.