# Project Structure

SmartCare is structured as a Monorepo containing both the Frontend (Vite/React) and Backend (Express).

## Root Directory
```txt
/SmartCare
├── backend/          # Node.js + Express API
├── frontend/         # Vite + React SPA
├── docs/             # Project documentation
└── README.md         # Entry point
```

## Frontend Architecture (`/frontend/src/`)

```txt
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
│   ├── cards/        # Data display containers
│   ├── common/       # Badges, Buttons, Loaders
│   ├── forms/        # Inputs, Selects, SearchBars
│   ├── modals/       # Popups (e.g., ConfirmationModal)
│   └── tables/       # Shared table layouts
├── context/          # React Contexts (AuthContext)
├── layouts/          # Structural page wrappers (Auth, Patient, Doctor, Admin)
├── pages/            # Feature-specific views
│   ├── admin/        # Admin Dashboard & User Management
│   ├── auth/         # Login & Register
│   ├── doctor/       # Slot Management & Appointment oversight
│   └── patient/      # Doctor Discovery & Booking workflows
├── routes/           # React Router DOM configurations & Guards
├── services/         # Axios API wrapper classes
│   ├── api.ts        # Axios instance & Interceptors
│   ├── auth.service.ts
│   ├── admin.service.ts
│   └── ...
└── App.tsx           # React Application Root
```

## Backend Architecture (`/backend/src/`)

```txt
src/
├── config/           # Database & Environment configuration
├── controllers/      # Request handlers & Business Logic
├── middlewares/      # JWT validation & Role-Based Access Control
├── models/           # Data definitions (if using ORM)
├── routes/           # Express Route definitions
└── index.ts          # Server entry point
```

## Design Philosophy
We utilized a **Feature-Based Module System** within the `pages/` directory. Each domain (Admin, Doctor, Patient) encapsulates its own specific sub-components (e.g., `src/pages/doctor/components/SlotForm.tsx`) to prevent the global `components/` directory from becoming bloated with hyper-specific UI elements. Only truly shared elements exist in the global folder.
