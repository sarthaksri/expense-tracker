# 💰 Expense Tracker

A modern expense tracking application with a React frontend and Node.js backend.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)

## ✨ Features

- 📊 **Dashboard** - Real-time expense overview with charts
- 📅 **Calendar View** - Track daily expenses visually
- 🎯 **Savings Goals** - Set and monitor monthly/overall goals
- 📈 **Analytics** - Category breakdown and trend charts
- 🔐 **Authentication** - JWT-based secure login/signup

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd expense-tracker

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 2. Environment Setup Example

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
npm run dev
```

- Frontend: http://localhost:8080
- Backend: http://localhost:5000

---

## 🏗️ Project Structure

```
expense-tracker/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # UI components
│   ├── contexts/           # Auth context
│   ├── hooks/              # Custom hooks (useExpenseStore)
│   ├── pages/              # Page components
│   └── lib/                # API utilities
│
├── backend/                # Backend (Node.js + Express)
│   ├── Schema/             # Mongoose models
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── SavingsGoal.js
│   │   ├── MonthlyIncome.js
│   │   ├── MonthlyRent.js
│   │   └── CustomCategory.js
│   ├── controller/         # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── server.js           # Express app entry
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/savings-goals` | Get savings goals |
| POST | `/api/savings-goals` | Create goal |
| PUT | `/api/savings-goals/:id` | Update goal |
| GET | `/api/monthly-data/income/:month` | Get monthly income |
| PUT | `/api/monthly-data/income/:month` | Update income |
| GET | `/api/custom-categories` | Get custom categories |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** - Fast dev server & build
- **TailwindCSS** + shadcn/ui
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Query** - Data fetching

### Backend
- **Express 5** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📦 Scripts

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start server
npm run dev      # Start with nodemon (hot reload)
```

---

## 📄 License

ISC © Sarthak
