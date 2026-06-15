# SmartCare Database Schema

The SmartCare system utilizes a relational MySQL database to maintain data integrity and support complex queries required by the Admin dashboard.

## Core Tables

### `Users`
Central identity table for Authentication and Role-Based Access.
- `id` (INT, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `phone` (VARCHAR)
- `role` (ENUM: 'ADMIN', 'DOCTOR', 'PATIENT')
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

### `DoctorProfiles`
Extended profile for users with the DOCTOR role.
- `id` (INT, PK)
- `user_id` (INT, FK -> Users)
- `specialization` (VARCHAR)
- `experience_years` (INT)
- `qualification` (VARCHAR)
- `consultation_fee` (DECIMAL)
- `bio` (TEXT)

### `PatientProfiles`
Extended profile for users with the PATIENT role.
- `id` (INT, PK)
- `user_id` (INT, FK -> Users)
- `blood_group` (VARCHAR)
- `date_of_birth` (DATE)
- `gender` (ENUM)
- `address` (TEXT)
- `medical_history` (TEXT)

### `Slots`
Represents a block of time a doctor has opened for booking.
- `id` (INT, PK)
- `doctor_id` (INT, FK -> Users)
- `slot_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `is_available` (BOOLEAN)

### `Appointments`
The transactional record binding a Patient, a Doctor, and a Slot.
- `id` (INT, PK)
- `patient_id` (INT, FK -> Users)
- `doctor_id` (INT, FK -> Users)
- `slot_id` (INT, FK -> Slots)
- `status` (ENUM: 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
- `notes` (TEXT)
- `cancel_reason` (TEXT)
- `created_at` (TIMESTAMP)

## Key Relationships
1. **User -> Profiles**: 1:1 relationship depending on role.
2. **Doctor -> Slots**: 1:N relationship. Doctors own many slots.
3. **Appointment -> Entities**: An appointment bridges 1 Patient, 1 Doctor, and locks 1 Slot.
