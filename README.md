# 🎓 CSBS Department Digital Management System

A full-stack web application for the **Computer Science and Business Systems (CSBS)** department at Maharaja Institute of Technology Mysore (MITM). Features a public-facing website and an admin panel with complete CRUD operations, powered by **Node.js**, **Express**, and **MongoDB Atlas**.

---

## ✨ Features

### 🌐 Public Website
- **Home** — Hero section, department vision & mission, live stats, latest notices
- **Notices** — Searchable announcements with category badges (urgent, new, general)
- **Events** — Upcoming events with online registration, dynamic forms, and QR-based payments
- **Faculty** — Faculty profiles with detailed modal view
- **Students** — Student directory filterable by year with search
- **Achievements** — Filterable by type (student, faculty, placement)
- **Dark/Light Theme** toggle with persistence

### 🔐 Admin Panel
- **Secure Login** — JWT-based authentication
- **Dashboard** — Summary cards with entity counts
- **Full CRUD** — Add, edit, and delete notices, events, faculty, students, and achievements
- **Event Management** — Custom registration form builder, QR code upload, entrance fees
- **Registration Viewer** — View and export event registrations to CSV

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Bootstrap Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT) |

---

## 📁 Project Structure

```
Department_project-CSBS-/
├── index.html                  # Home page
├── notices.html                # Notices page
├── events.html                 # Events page
├── faculty.html                # Faculty page
├── students.html               # Students page
├── achievements.html           # Achievements page
├── css/
│   └── style.css               # Global styles
├── js/
│   ├── data.js                 # API data layer (fetch-based)
│   ├── app.js                  # Public page logic
│   └── admin.js                # Admin panel logic
├── img/                        # Images & assets
├── admin/
│   ├── login.html              # Admin login
│   ├── dashboard.html          # Admin dashboard
│   ├── manage-notices.html     # Manage notices
│   ├── manage-events.html      # Manage events
│   ├── manage-faculty.html     # Manage faculty
│   ├── manage-students.html    # Manage students
│   └── manage-achievements.html# Manage achievements
└── backend/
    ├── server.js               # Express server entry point
    ├── seed.js                 # Database seeding script
    ├── .env                    # Environment variables (not in repo)
    ├── package.json            # Dependencies
    ├── middleware/
    │   └── auth.js             # JWT authentication middleware
    ├── models/                 # Mongoose schemas
    │   ├── Notice.js
    │   ├── Event.js
    │   ├── Faculty.js
    │   ├── Student.js
    │   ├── Achievement.js
    │   └── Registration.js
    └── routes/                 # Express API routes
        ├── auth.js
        ├── notices.js
        ├── events.js
        ├── faculty.js
        ├── students.js
        ├── achievements.js
        └── registrations.js
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varun666-maker/Department_project-CSBS-.git
   cd Department_project-CSBS-
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**

   Create a `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/csbs_db?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Seed the database** (first time only)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

---

## 🔑 Admin Access

| Field | Value |
|-------|-------|
| **URL** | `http://localhost:5000/admin/login.html` |
| **Username** | `admin` |
| **Password** | `admin123` |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Admin login, returns JWT |
| `GET` | `/api/notices` | — | List all notices |
| `POST` | `/api/notices` | JWT | Create notice |
| `PUT` | `/api/notices/:id` | JWT | Update notice |
| `DELETE` | `/api/notices/:id` | JWT | Delete notice |
| `GET` | `/api/events` | — | List all events |
| `POST` | `/api/events` | JWT | Create event |
| `PUT` | `/api/events/:id` | JWT | Update event |
| `DELETE` | `/api/events/:id` | JWT | Delete event |
| `GET` | `/api/faculty` | — | List all faculty |
| `POST` | `/api/faculty` | JWT | Add faculty |
| `PUT` | `/api/faculty/:id` | JWT | Update faculty |
| `DELETE` | `/api/faculty/:id` | JWT | Delete faculty |
| `GET` | `/api/students` | — | List all students |
| `POST` | `/api/students` | JWT | Add student |
| `PUT` | `/api/students/:id` | JWT | Update student |
| `DELETE` | `/api/students/:id` | JWT | Delete student |
| `GET` | `/api/achievements` | — | List all achievements |
| `POST` | `/api/achievements` | JWT | Add achievement |
| `PUT` | `/api/achievements/:id` | JWT | Update achievement |
| `DELETE` | `/api/achievements/:id` | JWT | Delete achievement |
| `GET` | `/api/registrations` | — | List registrations |
| `POST` | `/api/registrations` | — | Register for event |
| `DELETE` | `/api/registrations/:id` | JWT | Delete registration |

---

## 📄 License

This project is for academic purposes — CSBS Department, MITM.

---

*Built with ❤️ for the CSBS Department, Maharaja Institute of Technology Mysore*
