# EMR Appointment System

A full-stack Electronic Medical Records (EMR) Appointment Booking System built with the MERN stack. Supports role-based access for Super Admin, Receptionist, and Doctor.

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs  
**Frontend:** React, Vite, Tailwind CSS v4, Axios, React Router DOM

---

## Features

- JWT Authentication with Access & Refresh Tokens
- Role-Based Access Control (Super Admin, Receptionist, Doctor)
- Doctor Schedule & Slot Management
- Appointment Booking with conflict prevention
- Patient Management (Existing & New)
- Rate Limiting on API routes
- Responsive UI for desktop and mobile

---

## Roles & Access

| Role | Access |
|------|--------|
| Super Admin | Dashboard, Appointments, Patients, Manage Users |
| Receptionist | Dashboard, Scheduler, Appointments, Patients |
| Doctor | Dashboard, My Appointments |

---

## Project Structure
```
emr-appointment-booking/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/seeder.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   ├── .env.example
│   └── package.json
├── docs/
│   └── EMR-Appointment-System.postman_collection.json
├── screenshots/
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Postman (for API testing)

---

### 1. Clone the Repository
```bash
git clone https://github.com/SHAHANASHERINKM/emr-appointment-booking.git
cd emr-appointment-booking
```

---

### 2. Backend Setup
```bash
cd Backend
npm install
```

Copy the example env file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
NODE_ENV=development
PORT=5000

MONGO_URI=           # Add your MongoDB connection string
                     # Example: mongodb+srv://username:password@cluster.mongodb.net/emr_db

JWT_ACCESS_SECRET=   # Add any long random string
                     # Example: emr_access_super_secret_key_2024

JWT_REFRESH_SECRET=  # Add a different long random string
                     # Example: emr_refresh_super_secret_key_2024

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173   # Change this in production
```

#### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | App environment | `development` or `production` |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/emr_db` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens — use a long random string | `emr_access_secret_2024` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens — must be different from access secret | `emr_refresh_secret_2024` |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry — keep short for security | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS — must match exactly | `http://localhost:5173` |

---

### 3. Seed the Database

This creates the Super Admin account only. The evaluator runs this once with their own MongoDB:
```bash
node src/utils/seeder.js
```

Super Admin credentials after seeding:
```
Email:    admin@emr.com
Password: Admin@1234
```

---

### 4. Start the Backend
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 5. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Copy the example env file:
```bash
cp .env.example .env
```

Open `.env` — it should look like this:
```env
VITE_API_URL=http://localhost:5000/api   # Change this in production
```

#### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL — update this in production | `http://localhost:5000/api` |

---

### 6. Start the Frontend
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@emr.com | Admin@1234 |

> Receptionist and Doctor accounts are created by Super Admin from the Manage Users page.

---

## API Documentation

Postman collection is available in the `/docs` folder.

Import `docs/EMR-Appointment-System.postman_collection.json` into Postman.

Base URL: `http://localhost:5000/api`

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get tokens |
| POST | `/auth/refresh` | Get new access token |
| POST | `/auth/logout` | Logout and clear token |
| GET | `/auth/me` | Get current logged in user |

### User Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Super Admin |
| POST | `/users` | Create doctor or receptionist | Super Admin |
| PUT | `/users/:id` | Update user | Super Admin |
| DELETE | `/users/:id` | Delete user | Super Admin |
| GET | `/doctors` | Get all doctors | All roles |
| PUT | `/doctors/:id/schedule` | Update doctor schedule | Super Admin |

### Slot Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/slots?doctorId=&date=` | Get available slots for a doctor on a date | All roles |

### Appointment Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/appointments` | Get all appointments | All roles |
| POST | `/appointments` | Book new appointment | Admin, Receptionist |
| PUT | `/appointments/:id` | Update appointment | Admin, Receptionist |
| DELETE | `/appointments/:id` | Delete appointment | Admin, Receptionist |
| POST | `/appointments/:id/arrive` | Mark patient as arrived | Admin, Receptionist |

### Patient Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/patients/search?q=` | Search patients by name, mobile or ID | Admin, Receptionist |
| GET | `/patients/count` | Get total patient count | Super Admin |
| POST | `/patients` | Create new patient | Admin, Receptionist |
| GET | `/patients/:id` | Get patient details | All roles |
| PUT | `/patients/:id` | Update patient | Admin, Receptionist |

---

## Screenshots

### Login Page
![Login](screenshots/01-login.png)

### Admin Dashboard
![Admin Dashboard](screenshots/02-admin-dashboard.png)

### Admin Appointments
![Appointments](screenshots/03-admin-appointments.png)

### Admin Patients
![Patients](screenshots/04-admin-patients.png)

### Manage Users
![Manage Users](screenshots/05-manage-users.png)

### Receptionist Dashboard
![Receptionist Dashboard](screenshots/06-receptionist-dashboard.png)

### Scheduler - Select Doctor & Date
![Scheduler Step 1](screenshots/07-scheduler-step1.png)

### Scheduler - Choose Slot
![Scheduler Step 2](screenshots/08-scheduler-step2.png)

### Scheduler - Book Appointment
![Scheduler Step 3](screenshots/09-scheduler-step3.png)

### Doctor Dashboard
![Doctor Dashboard](screenshots/10-doctor-dashboard.png)

### Mobile View
![Mobile](screenshots/11-mobile-view.png)

---

## Important Notes

- Never commit your `.env` file — it is listed in `.gitignore`
- Always use your own MongoDB URI — never share your credentials
- Run the seeder before starting the app to create the Super Admin
- JWT secrets should be long random strings in production
- `CLIENT_URL` must match your frontend URL exactly to avoid CORS errors
- `VITE_API_URL` must match your backend URL exactly

---

## Author

Shahana Sherin KM  
GitHub: [@SHAHANASHERINKM](https://github.com/SHAHANASHERINKM)