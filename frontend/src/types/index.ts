// ==========================================
// Smart Care - TypeScript Type Definitions
// ==========================================

// --- Core Entity Types ---

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: Specialization;
  experience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  image: string;
  location: string;
  consultationFee: number;
  availableSlots: AvailableDay[];
  isAvailable: boolean;
  education: string;
  languages: string[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: Specialization;
  doctorImage: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  doctorId: string;
  doctorName: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: number; // in minutes
  isActive: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  avatar?: string;
}

// --- Supporting Types ---

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface AvailableDay {
  day: DayOfWeek;
  slots: TimeSlot[];
}

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  activeSchedules: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientAvatar: string;
  rating: number;
  comment: string;
  date: string;
  doctorName: string;
  specialization: Specialization;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StatCard {
  label: string;
  value: number;
  icon: string;
  trend?: number;
  color: string;
}

// --- API Types ---

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// --- Booking Flow Types ---

export interface BookingData {
  doctorId: string;
  doctor?: Doctor;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

// --- Enum-like Types ---

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'in-progress';

export type Specialization =
  | 'Cardiology'
  | 'Dermatology'
  | 'Endocrinology'
  | 'Gastroenterology'
  | 'General Practice'
  | 'Neurology'
  | 'Obstetrics & Gynecology'
  | 'Oncology'
  | 'Ophthalmology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Psychiatry'
  | 'Pulmonology'
  | 'Radiology'
  | 'Urology';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

// --- Filter Types ---

export interface DoctorFilters {
  specialization: Specialization | 'all';
  search: string;
  sortBy: 'rating' | 'experience' | 'fee-low' | 'fee-high' | 'name';
  availableOnly: boolean;
}

export interface AppointmentFilters {
  status: AppointmentStatus | 'all';
  dateRange?: { start: string; end: string };
}

// --- Navigation Types ---

export interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

export interface SidebarLink extends NavLink {
  badge?: number;
}
