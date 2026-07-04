# 🔥 IOCL Spark – Employee Engagement Portal

A full-stack gamified employee engagement platform built for IOCL Panipat Refinery, designed to boost employee morale and team bonding through interactive games, rewards, and real-time engagement features.

## 🚀 Features

- **Authentication & Authorization** — Secure JWT-based login/register with role-based access control (Employee/Admin)
- **Gamification System** — Earn coins and XP by playing games, with automatic level progression
- **4 Interactive Games** — Tic Tac Toe, Quiz Challenge, Reaction Test, Spin Wheel
- **Real-time Leaderboard** — Ranks employees by coins earned, with medal highlights for top performers
- **Badges & Achievements** — Automatically unlocked based on milestones (coins earned, games played, level reached)
- **Admin Dashboard** — Manage employees (view/delete) and broadcast announcements
- **Announcements** — Admins can post updates that all employees see on their dashboard
- **Responsive UI** — Custom IOCL-branded design (navy & red theme) built with Bootstrap 5

## 🛠️ Tech Stack

**Frontend:** React.js (Vite), React Router DOM, Axios, Bootstrap 5, Context API
**Backend:** Node.js, Express.js (MVC architecture)
**Database:** MongoDB Atlas, Mongoose
**Authentication:** JWT, bcrypt.js
**Tools:** Postman, Git & GitHub, VS Code

## 📁 Project Structure
iocl-spark/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/       # Auth & role-based protection
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── utils/            # Helper functions (JWT, badges)
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar)
│   │   ├── context/      # Auth state management
│   │   ├── games/        # Game components
│   │   ├── pages/        # Page-level components
│   │   └── services/     # Axios API config
└── README.md
## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
Run the server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, with the backend running on `http://localhost:5000`.

## 👩‍💻 Author

**Sakshi Choken**
Built as an internship project for IOCL Panipat Refinery.

---