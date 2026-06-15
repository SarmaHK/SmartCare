# SmartCare API Documentation

## Introduction

The SmartCare API is a RESTful backend service built for the SmartCare Medical Appointment System. It facilitates user authentication, doctor-patient interactions, scheduling, and administrative controls.

**Technology Stack:**
- Node.js
- Express
- TypeScript
- MySQL
- Prisma

**Base URL:** `/api/v1`

---

## Authentication

### Register
**Endpoint:** `/auth/register`
**HTTP Method:** `POST`
**Description:** Registers a new user in the system.
**Authentication Required:** No
**Required Role:** None
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "password": "Password123!",
  "role": "PATIENT"
}
```
**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "role": "PATIENT"
    }
  }
}
```
**Error Responses:**
- `400 Bad Request` - Validation failed
- `409 Conflict` - Email or phone already in use

### Login
**Endpoint:** `/auth/login`
**HTTP Method:** `POST`
**Description:** Authenticates a user and returns a JWT token.
**Authentication Required:** No
**Required Role:** None
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "role": "PATIENT"
    }
  }
}
```
**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid email or password

### Get Current User
**Endpoint:** `/auth/me`
**HTTP Method:** `GET`
**Description:** Retrieves the profile of the currently authenticated user.
**Authentication Required:** Yes
**Required Role:** Any Valid Role
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "role": "PATIENT"
  }
}
```
**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

---

## Patients

### Get Profile
**Endpoint:** `/patients/profile`
**HTTP Method:** `GET`
**Description:** Retrieves the detailed patient profile of the authenticated user.
**Authentication Required:** Yes
**Required Role:** `PATIENT`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "MALE",
    "bloodGroup": "O+",
    "medicalHistory": "None"
  }
}
```
**Error Responses:**
- `401 Unauthorized` - Missing token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Profile not found

### Update Profile
**Endpoint:** `/patients/profile`
**HTTP Method:** `PUT`
**Description:** Updates the profile details for the authenticated patient.
**Authentication Required:** Yes
**Required Role:** `PATIENT`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "bloodGroup": "O+",
  "address": "123 Main St",
  "emergencyContact": "0987654321",
  "medicalHistory": "No prior conditions"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "bloodGroup": "O+"
  }
}
```
**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized`
- `403 Forbidden`

---

## Doctors

### Get All Doctors
**Endpoint:** `/doctors`
**HTTP Method:** `GET`
**Description:** Retrieves a list of active doctors.
**Authentication Required:** No
**Required Role:** None
**Request Parameters:** None
**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `page` (optional): Pagination offset
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctors fetched successfully",
  "data": [
    {
      "id": 1,
      "user": {
        "fullName": "Dr. Jane Smith"
      },
      "specialization": "Cardiology",
      "consultationFee": 150.00
    }
  ]
}
```
**Error Responses:** None standard.

### Get Doctor By ID
**Endpoint:** `/doctors/:id`
**HTTP Method:** `GET`
**Description:** Retrieves full profile of a specific doctor by ID.
**Authentication Required:** No
**Required Role:** None
**Request Parameters:**
- `id` (integer) - Doctor Profile ID
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctor fetched successfully",
  "data": {
    "id": 1,
    "specialization": "Cardiology",
    "experienceYears": 10
  }
}
```
**Error Responses:**
- `400 Bad Request` - Invalid ID format
- `404 Not Found` - Doctor not found

### Create Doctor
**Endpoint:** `/doctors`
**HTTP Method:** `POST`
**Description:** Onboards a new doctor profile into the system.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "userId": 2,
  "specialization": "Dermatology",
  "qualification": "MD",
  "experienceYears": 5,
  "consultationFee": 100.00,
  "bio": "Expert in dermatology."
}
```
**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {
    "id": 2,
    "userId": 2
  }
}
```
**Error Responses:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `409 Conflict` - Profile already exists for this user

### Update Doctor
**Endpoint:** `/doctors/:id`
**HTTP Method:** `PUT`
**Description:** Updates a specific doctor's profile details.
**Authentication Required:** Yes
**Required Role:** `ADMIN`, `DOCTOR` (Self)
**Request Parameters:**
- `id` (integer) - Doctor Profile ID
**Query Parameters:** None
**Request Body:**
```json
{
  "consultationFee": 120.00,
  "bio": "Updated bio details"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "data": {
    "id": 1,
    "consultationFee": 120.00
  }
}
```
**Error Responses:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

### Delete Doctor
**Endpoint:** `/doctors/:id`
**HTTP Method:** `DELETE`
**Description:** Deactivates or permanently deletes a doctor profile.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:**
- `id` (integer) - Doctor Profile ID
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```
**Error Responses:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

## Appointment Slots

### Create Slot
**Endpoint:** `/slots`
**HTTP Method:** `POST`
**Description:** Creates a new availability time slot for a doctor.
**Authentication Required:** Yes
**Required Role:** `DOCTOR`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "slotDate": "2026-06-20",
  "startTime": "09:00:00",
  "endTime": "09:30:00"
}
```
**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Slot created successfully",
  "data": {
    "id": 1,
    "doctorId": 2,
    "isAvailable": true
  }
}
```
**Error Responses:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`

### Get Available Slots
**Endpoint:** `/slots/available`
**HTTP Method:** `GET`
**Description:** Fetches unbooked slots. Can be filtered by doctor and date.
**Authentication Required:** Yes
**Required Role:** `PATIENT`, `DOCTOR`, `ADMIN`
**Request Parameters:** None
**Query Parameters:**
- `doctorId` (integer)
- `date` (YYYY-MM-DD)
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Slots fetched successfully",
  "data": [
    {
      "id": 1,
      "slotDate": "2026-06-20T00:00:00.000Z",
      "startTime": "1970-01-01T09:00:00.000Z"
    }
  ]
}
```
**Error Responses:** None

### Update Slot
**Endpoint:** `/slots/:id`
**HTTP Method:** `PUT`
**Description:** Modifies the timing or status of an existing unbooked slot.
**Authentication Required:** Yes
**Required Role:** `DOCTOR`
**Request Parameters:**
- `id` (integer) - Slot ID
**Query Parameters:** None
**Request Body:**
```json
{
  "startTime": "10:00:00",
  "endTime": "10:30:00"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Slot updated successfully",
  "data": {
    "id": 1
  }
}
```
**Error Responses:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

### Delete Slot
**Endpoint:** `/slots/:id`
**HTTP Method:** `DELETE`
**Description:** Deletes a slot. Not allowed if the slot is already booked.
**Authentication Required:** Yes
**Required Role:** `DOCTOR`
**Request Parameters:**
- `id` (integer) - Slot ID
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Slot deleted successfully"
}
```
**Error Responses:**
- `400 Bad Request` - Cannot delete booked slot
- `403 Forbidden`
- `404 Not Found`

---

## Appointments

### Book Appointment
**Endpoint:** `/appointments`
**HTTP Method:** `POST`
**Description:** Books an appointment for a patient in a specified slot.
**Authentication Required:** Yes
**Required Role:** `PATIENT`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:**
```json
{
  "doctorId": 2,
  "slotId": 1,
  "notes": "Fever and mild headache"
}
```
**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": 10,
    "status": "PENDING"
  }
}
```
**Error Responses:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `409 Conflict` - Slot already booked

### Get My Appointments
**Endpoint:** `/appointments/my`
**HTTP Method:** `GET`
**Description:** Retrieves all appointments for the authenticated patient.
**Authentication Required:** Yes
**Required Role:** `PATIENT`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": [
    {
      "id": 10,
      "doctorId": 2,
      "status": "PENDING",
      "slot": {
        "slotDate": "2026-06-20T00:00:00.000Z"
      }
    }
  ]
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`

### Get Doctor Appointments
**Endpoint:** `/appointments/doctor`
**HTTP Method:** `GET`
**Description:** Retrieves all appointments scheduled for the authenticated doctor.
**Authentication Required:** Yes
**Required Role:** `DOCTOR`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": [
    {
      "id": 10,
      "patientId": 3,
      "status": "PENDING"
    }
  ]
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`

### Get All Appointments
**Endpoint:** `/appointments`
**HTTP Method:** `GET`
**Description:** Retrieves a complete list of all appointments in the system.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": []
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`

### Cancel Appointment
**Endpoint:** `/appointments/:id/cancel`
**HTTP Method:** `PATCH`
**Description:** Cancels an existing appointment.
**Authentication Required:** Yes
**Required Role:** `PATIENT`, `DOCTOR`
**Request Parameters:**
- `id` (integer) - Appointment ID
**Query Parameters:** None
**Request Body:**
```json
{
  "cancelReason": "Patient feeling better"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 10,
    "status": "CANCELLED"
  }
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### Reschedule Appointment
**Endpoint:** `/appointments/:id/reschedule`
**HTTP Method:** `PATCH`
**Description:** Changes the time slot for an existing appointment.
**Authentication Required:** Yes
**Required Role:** `PATIENT`
**Request Parameters:**
- `id` (integer) - Appointment ID
**Query Parameters:** None
**Request Body:**
```json
{
  "newSlotId": 2
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "data": {
    "id": 10,
    "slotId": 2
  }
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`

### Update Appointment Status
**Endpoint:** `/appointments/:id/status`
**HTTP Method:** `PATCH`
**Description:** Updates the status of an appointment (e.g., CONFIRMED, COMPLETED).
**Authentication Required:** Yes
**Required Role:** `DOCTOR`, `ADMIN`
**Request Parameters:**
- `id` (integer) - Appointment ID
**Query Parameters:** None
**Request Body:**
```json
{
  "status": "COMPLETED"
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment status updated",
  "data": {
    "id": 10,
    "status": "COMPLETED"
  }
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## Admin

### Dashboard Statistics
**Endpoint:** `/admin/dashboard`
**HTTP Method:** `GET`
**Description:** Retrieves aggregate statistics for the admin dashboard.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:** None
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalPatients": 120,
    "totalDoctors": 15,
    "totalAppointments": 450
  }
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`

### Get Users
**Endpoint:** `/admin/users`
**HTTP Method:** `GET`
**Description:** Retrieves a list of all users in the system.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:** None
**Query Parameters:**
- `role` (optional)
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "id": 1,
      "email": "johndoe@example.com",
      "isActive": true
    }
  ]
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`

### Update User Status
**Endpoint:** `/admin/users/:id/status`
**HTTP Method:** `PATCH`
**Description:** Suspends or activates a user account.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:**
- `id` (integer) - User ID
**Query Parameters:** None
**Request Body:**
```json
{
  "isActive": false
}
```
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User status updated",
  "data": {
    "id": 1,
    "isActive": false
  }
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### Delete User
**Endpoint:** `/admin/users/:id`
**HTTP Method:** `DELETE`
**Description:** Permanently deletes a user from the system.
**Authentication Required:** Yes
**Required Role:** `ADMIN`
**Request Parameters:**
- `id` (integer) - User ID
**Query Parameters:** None
**Request Body:** None
**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```
**Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

## Role Permission Matrix

| Role | Create | Read | Update | Delete | Manage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Doctors, Users | All Data, Dashboard | Doctor Profiles, User Status | Doctors, Users | Full system management and overrides. |
| **DOCTOR** | Appointment Slots | Own Profile, Own Appts | Own Profile, Appt Status | Own Unbooked Slots | Can manage own schedule and patient statuses. |
| **PATIENT** | Appointments (Booking) | Own Profile, Own Appts | Own Profile, Appt Reschedule | Cancel Own Appointments | Restricted to own medical data and bookings. |

---

## Error Responses

When an error occurs, the API returns a JSON response containing an error message. The `errors` array may be populated if multiple validation failures occur.

```json
{
  "success": false,
  "message": "Description of the error",
  "errors": []
}
```

## Status Codes

| Code | Status | Description |
| :--- | :--- | :--- |
| `200` | OK | The request was successfully completed. |
| `201` | Created | A new resource was successfully created. |
| `400` | Bad Request | The request was invalid or could not be understood (e.g., validation failed). |
| `401` | Unauthorized | Authentication failed or user does not have a valid token. |
| `403` | Forbidden | Authentication succeeded, but the user does not have the required permissions. |
| `404` | Not Found | The requested resource does not exist. |
| `409` | Conflict | The request conflicts with current state of the server (e.g., duplicate entry, slot already booked). |
| `500` | Internal Server Error | An error occurred on the server. |
