# SmartCare Frontend Architecture

## Overview
The SmartCare frontend is a React Single Page Application (SPA) built with Vite and TypeScript. It utilizes a modular, feature-based architecture with strong emphasis on reusable components, robust typing, and strict role-based layouts.

## Tech Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Bundler**: Vite
- **Routing**: React Router DOM (v6+)
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Folder Structure
```txt
src/
├── assets/           # Static files (images, icons, vectors)
├── components/       # Reusable, stateless UI components
│   ├── common/       # Button, LoadingSpinner, EmptyState, PageHeader
│   ├── forms/        # Input, Select, Checkbox, complex form controls
│   ├── tables/       # Generic Table, TableHeader, TableRow, TableCell
│   ├── cards/        # Generic Card containers
│   └── modals/       # Base Modal component
├── layouts/          # Structural page wrappers
│   ├── AuthLayout.tsx    # Unauthenticated split-screen layout
│   ├── DashboardLayout.tsx # Generic responsive sidebar/header shell
│   ├── PatientLayout.tsx # Applies Patient navigation
│   ├── DoctorLayout.tsx  # Applies Doctor navigation
│   └── AdminLayout.tsx   # Applies Admin navigation
├── pages/            # Routable feature modules
│   ├── auth/         # Login, Register
│   ├── patient/      # Dashboard, Appointments, Booking
│   ├── doctor/       # Dashboard, Slots, Patient Management
│   └── admin/        # System overview, User management
├── routes/           # Routing configuration
│   └── index.tsx     # Centralized routing map with Layout assignments
├── services/         # API integration (Axios instances and calls)
├── hooks/            # Custom React hooks
├── types/            # Global TypeScript definitions
├── utils/            # Helper functions (cn.ts, formatters)
└── context/          # React Context providers (Auth, Theme)
```

## Styling System & Theme
We use Tailwind CSS v4 with a custom defined theme mapped directly in `src/index.css`.
- **Primary Color**: Trust Blue (`#14b8a6` base) for primary actions and highlights.
- **Secondary Color**: Slate (`#64748b` base) for structural elements, borders, and text.
- **Typography**: `Inter` or system-sans fallback.
- **Micro-interactions**: Subtle hover states, focus rings (`focus:ring-2`), and animation (`animate-in`, `fade-in`, `zoom-in`) are applied via generic component classes.

## Layout Strategy
Instead of repeating headers and sidebars on every page, we use React Router `<Outlet />` wrappers.
1. The **DashboardLayout** defines the core responsive structure: Mobile hamburger menu, sticky header, side navigation, and content area.
2. The specific role layouts (**PatientLayout**, **DoctorLayout**, **AdminLayout**) simply instantiate `DashboardLayout` by passing their specific navigation links.

## Global Components Strategy
Global components like `Button`, `Input`, and `Modal` are completely stateless. They rely exclusively on props to define their appearance and behavior. We use the `cn()` utility (`clsx` + `tailwind-merge`) to allow pages to optionally override styling on a per-instance basis without conflicting Tailwind classes.
