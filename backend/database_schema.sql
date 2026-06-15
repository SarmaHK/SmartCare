CREATE DATABASE IF NOT EXISTS smart_care;
USE smart_care;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE doctor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    qualification VARCHAR(255),
    experience_years INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE patient_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE appointment_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,

    doctor_id INT NOT NULL,

    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    is_booked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (doctor_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    slot_id INT NOT NULL UNIQUE,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    notes TEXT,
    cancel_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (doctor_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (slot_id)
        REFERENCES appointment_slots(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_slots_date ON appointment_slots(slot_date);
CREATE INDEX idx_slots_doctor ON appointment_slots(doctor_id);
