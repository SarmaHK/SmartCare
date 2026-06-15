# SmartCare API Documentation

Base URL: `/api/v1`

## Authentication

### `POST /auth/register`
Register a new user.
- **Body**: `{ fullName, email, password, role }`
- **Response**: `{ success: true, token, user }`

### `POST /auth/login`
Authenticate a user.
- **Body**: `{ email, password }`
- **Response**: `{ success: true, token, user }`

## Patient Endpoints

### `GET /patients/profile`
Get logged in patient's profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: PatientProfile }`

### `PUT /patients/profile`
Update logged in patient's profile.
- **Body**: `{ bloodGroup, medicalHistory, address, etc. }`
- **Response**: `{ success: true, data: PatientProfile }`

## Doctor Endpoints

### `GET /doctors`
Get all doctors (paginated).
- **Query**: `?page=1&limit=10&search=&specialization=`
- **Response**: `{ success: true, data: { doctors: DoctorProfile[], total: number } }`

### `GET /doctors/:id`
Get public profile of a specific doctor.
- **Response**: `{ success: true, data: DoctorProfile }`

### `GET /doctors/profile`
Get logged in doctor's private profile.
- **Response**: `{ success: true, data: DoctorProfile }`

### `PUT /doctors/profile`
Update logged in doctor's profile.
- **Body**: `{ bio, consultationFee, etc. }`

## Slot Management

### `GET /slots/my`
Get all slots for logged in doctor.
- **Response**: `{ success: true, data: Slot[] }`

### `POST /slots`
Create a new slot.
- **Body**: `{ slotDate, startTime, endTime }`

### `PUT /slots/:id`
Update an existing available slot.
- **Body**: `{ slotDate, startTime, endTime }`

### `DELETE /slots/:id`
Delete an available slot.

### `GET /slots/available`
Get available slots for a specific doctor.
- **Query**: `?doctorId=1&date=YYYY-MM-DD`

## Appointments

### `POST /appointments`
Book a new appointment.
- **Body**: `{ slotId, notes }`

### `GET /appointments/my`
Get patient's appointments.

### `GET /appointments/doctor`
Get doctor's appointments.

### `PATCH /appointments/:id/status`
Update appointment status (CONFIRMED, COMPLETED, CANCELLED).
- **Body**: `{ status }`

## Admin Endpoints

### `GET /admin/dashboard`
Get system-wide statistics.

### `GET /admin/users`
Get all users with filtering.

### `PATCH /admin/users/:id/status`
Activate or deactivate a user.

### `GET /admin/reports/appointments`
Get analytical data for charting.
