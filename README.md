# SmartCare - Medical Appointment Management System

SmartCare is a comprehensive, modern, and professional healthcare appointment management system. Designed specifically for university projects, it features a clean blue-and-white theme, seamless user experiences, and robust role-based access control.

## 🚀 Features

- **Multi-Role System**: Dedicated interfaces for Patients, Doctors, and Administrators.
- **Patient Portal**: Browse doctors, view profiles, and book appointments through an intuitive interface.
- **Doctor Portal**: Manage availability slots and seamlessly update patient appointment statuses.
- **Admin Dashboard**: Total system oversight with rich analytics, reports, and user management capabilities.
- **Modern Design**: Built strictly against a custom design system prioritizing professional, healthcare-oriented aesthetics.

## 💻 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts (Analytics)

### Backend
- Node.js & Express
- TypeScript
- MySQL
- JWT Authentication

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)

### 1. Database Setup
Execute the SQL scripts found in `backend/database_schema.sql` to initialize the database structure and default admin account.

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with DB credentials and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [User Guide](docs/USER_GUIDE.md)
- [Testing Report](docs/TESTING_REPORT.md)

## 🎨 Design Philosophy
SmartCare avoids overly flashy or "startup" style designs. It relies on a classic, minimalistic, and trustworthy aesthetic using primary blue and neutral white palettes, ensuring the system feels professional and accessible to all users.
