# 🏥 Smart Care

> Modern Healthcare Appointment Management Platform

Smart Care is a full-stack healthcare appointment booking platform that allows patients to book appointments with doctors, manage existing appointments, view schedules, and enables administrators to manage doctors and availability.

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Zustand (State Management)
- Framer Motion (Animations)
- React Hook Form + Zod (Form Validation)
- Axios (HTTP Client)
- Lucide React (Icons)
- React Hot Toast (Notifications)

### Backend (Phase 2)
- Node.js + Express.js
- TypeScript
- MySQL

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Development

```bash
# Start frontend dev server
npm run dev:frontend

# Start backend dev server (Phase 2)
npm run dev:backend
```

### Build

```bash
# Build frontend for production
npm run build:frontend
```

## Project Structure

```
smart-care/
├── frontend/          # React frontend application
├── backend/           # Express backend API (Phase 2)
├── README.md
├── .gitignore
└── package.json
```

## Features

### Patient Module
- Browse and search doctors
- Filter by specialization
- View doctor profiles and availability
- Book, cancel, and reschedule appointments

### Doctor Module
- View today's and upcoming appointments
- Check schedule
- View patient details

### Admin Module
- Dashboard with system statistics
- Manage doctors and schedules
- Monitor appointments

## License

ISC
