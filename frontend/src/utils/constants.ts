// ==========================================
// Smart Care - Application Constants
// ==========================================

import type { Specialization, SidebarLink } from '../types';

// --- Routes ---
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  
  PATIENT_DASHBOARD: '/patient',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_BOOK: '/patient/book',
  PATIENT_PROFILE: '/patient/profile',

  DOCTOR_DASHBOARD: '/doctor',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_SCHEDULE: '/doctor/schedule',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_PROFILE: '/doctor/profile',

  ADMIN_DASHBOARD: '/admin',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  ADMIN_SCHEDULES: '/admin/schedules',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// --- Navigation ---
export const PATIENT_SIDEBAR_LINKS: SidebarLink[] = [
  { label: 'Dashboard', path: ROUTES.PATIENT_DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Appointments', path: ROUTES.PATIENT_APPOINTMENTS, icon: 'Calendar' },
  { label: 'Book Appointment', path: ROUTES.PATIENT_BOOK, icon: 'Stethoscope' },
  { label: 'Profile', path: ROUTES.PATIENT_PROFILE, icon: 'Users' },
];

export const DOCTOR_SIDEBAR_LINKS: SidebarLink[] = [
  { label: 'Dashboard', path: ROUTES.DOCTOR_DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Appointments', path: ROUTES.DOCTOR_APPOINTMENTS, icon: 'Calendar' },
  { label: 'Schedule', path: ROUTES.DOCTOR_SCHEDULE, icon: 'Clock' },
  { label: 'Patients', path: ROUTES.DOCTOR_PATIENTS, icon: 'Users' },
  { label: 'Profile', path: ROUTES.DOCTOR_PROFILE, icon: 'Settings' },
];

export const ADMIN_SIDEBAR_LINKS: SidebarLink[] = [
  { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Doctors', path: ROUTES.ADMIN_DOCTORS, icon: 'Stethoscope' },
  { label: 'Appointments', path: ROUTES.ADMIN_APPOINTMENTS, icon: 'Calendar' },
  { label: 'Schedules', path: ROUTES.ADMIN_SCHEDULES, icon: 'Clock' },
  { label: 'Patients', path: ROUTES.ADMIN_PATIENTS, icon: 'Users' },
  { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: 'Settings' },
];

// --- Specializations ---
export const SPECIALIZATIONS: Specialization[] = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
];

// --- Appointment Statuses ---
export const APPOINTMENT_STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    color: 'bg-sky-100 text-sky-700',
    dotColor: 'bg-sky-500',
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-amber-100 text-amber-700',
    dotColor: 'bg-amber-500',
  },
} as const;

// --- Booking Steps ---
export const BOOKING_STEPS = [
  { step: 1, label: 'Select Doctor', icon: 'Stethoscope' },
  { step: 2, label: 'Select Date', icon: 'Calendar' },
  { step: 3, label: 'Select Time', icon: 'Clock' },
  { step: 4, label: 'Patient Details', icon: 'UserCheck' },
  { step: 5, label: 'Summary', icon: 'ClipboardList' },
  { step: 6, label: 'Confirmation', icon: 'CheckCircle' },
] as const;

// --- Services ---
export const SERVICES = [
  {
    id: '1',
    title: 'Online Appointment Booking',
    description: 'Book appointments instantly with your preferred doctors from the comfort of your home.',
    icon: 'CalendarCheck',
  },
  {
    id: '2',
    title: 'Schedule Management',
    description: 'Easily manage, reschedule, or cancel your appointments with just a few clicks.',
    icon: 'CalendarClock',
  },
  {
    id: '3',
    title: 'Specialist Consultation',
    description: 'Connect with top specialists across various medical fields for expert care.',
    icon: 'Stethoscope',
  },
  {
    id: '4',
    title: 'Medical Assistance',
    description: '24/7 support and medical assistance to guide you through your healthcare journey.',
    icon: 'HeartPulse',
  },
] as const;

// --- Statistics (for home page) ---
export const HOME_STATS = [
  { label: 'Expert Doctors', value: 150, icon: 'UserCheck', color: '#0EA5E9' },
  { label: 'Patients Served', value: 12000, icon: 'Users', color: '#22C55E' },
  { label: 'Appointments Done', value: 45000, icon: 'CalendarCheck', color: '#8B5CF6' },
  { label: 'Specializations', value: 15, icon: 'Award', color: '#F59E0B' },
] as const;

// --- Days of Week ---
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

// --- Time Slots ---
export const DEFAULT_TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
] as const;

// --- API Base URL ---
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Pagination ---
export const DEFAULT_PAGE_SIZE = 10;
export const DOCTOR_PAGE_SIZE = 12;
