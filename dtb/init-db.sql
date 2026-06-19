-- MiYuki Express Database Initialization
-- MySQL 8.0

CREATE DATABASE IF NOT EXISTS miyuki_db;
USE miyuki_db;

-- ===== USERS & AUTHENTICATION =====
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    address VARCHAR(500),
    identification_number VARCHAR(50),
    status ENUM('ACTIVE', 'INACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== ROLES & PERMISSIONS =====
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== BUS COMPANIES =====
CREATE TABLE bus_companies (
    company_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    tax_number VARCHAR(50) UNIQUE,
    license_number VARCHAR(50) UNIQUE,
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== BUSES =====
CREATE TABLE buses (
    bus_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_id BIGINT NOT NULL,
    registration_plate VARCHAR(50) NOT NULL UNIQUE,
    bus_name VARCHAR(255),
    total_seats INT NOT NULL,
    bus_type ENUM('SEAT', 'SLEEPER', 'LIMOUSINE') DEFAULT 'SEAT',
    year_manufactured INT,
    status ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES bus_companies(company_id) ON DELETE CASCADE,
    INDEX idx_company (company_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== ROUTES =====
CREATE TABLE routes (
    route_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    departure_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    distance_km INT,
    estimated_hours DECIMAL(5, 2),
    base_price DECIMAL(10, 2) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cities (departure_city, destination_city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TRIPS (Scheduled Bus Trips) =====
CREATE TABLE trips (
    trip_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE RESTRICT,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE RESTRICT,
    INDEX idx_departure (departure_time),
    INDEX idx_status (status),
    INDEX idx_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== SEATS =====
CREATE TABLE seats (
    seat_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_type ENUM('REGULAR', 'VIP', 'WINDOW') DEFAULT 'REGULAR',
    is_available BOOLEAN DEFAULT TRUE,
    booking_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (trip_id, seat_number),
    INDEX idx_trip (trip_id),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== BOOKINGS =====
CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('UNPAID', 'PAID', 'REFUNDED') DEFAULT 'UNPAID',
    departure_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_status (booking_status),
    INDEX idx_booking_code (booking_code),
    INDEX idx_departure_date (departure_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== BOOKING DETAILS (Passenger Info) =====
CREATE TABLE booking_details (
    detail_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20),
    passenger_email VARCHAR(255),
    identification_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE RESTRICT,
    INDEX idx_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== PAYMENTS =====
CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date DATETIME,
    refund_date DATETIME,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_status (payment_status),
    INDEX idx_booking (booking_id),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== REVIEWS & RATINGS =====
CREATE TABLE reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    INDEX idx_trip (trip_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== REFUNDS =====
CREATE TABLE refunds (
    refund_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    payment_id BIGINT,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_reason VARCHAR(255),
    refund_status ENUM('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    INDEX idx_status (refund_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== NOTIFICATIONS =====
CREATE TABLE notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== DISCOUNTS & PROMOTIONS =====
CREATE TABLE discounts (
    discount_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('PERCENTAGE', 'FIXED') DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(10, 2) NOT NULL,
    max_usage INT,
    current_usage INT DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== INSERT DEFAULT ROLES =====
INSERT INTO roles (role_name, description) VALUES
('CUSTOMER', 'Regular customer'),
('DRIVER', 'Bus driver'),
('COMPANY_ADMIN', 'Bus company administrator'),
('ADMIN', 'System administrator');

-- ===== INSERT SAMPLE DATA =====

-- Bus Companies
INSERT INTO bus_companies (company_name, phone, email, address, rating) VALUES
('Phương Trang', '1900 1234', 'info@phuongtrang.vn', 'TP. Hồ Chí Minh', 4.80),
('Thành Bưởi', '1900 5678', 'info@thanhbuoi.vn', 'TP. Hồ Chí Minh', 4.70),
('Hoàng Long', '1900 9012', 'info@hoanglongbus.vn', 'Hà Nội', 4.60);

-- Buses
INSERT INTO buses (company_id, registration_plate, bus_name, total_seats, bus_type) VALUES
(1, '51B-12345', 'PT Express 01', 45, 'SEAT'),
(1, '51B-12346', 'PT Sleeper 01', 36, 'SLEEPER'),
(2, '51C-23456', 'TB Limousine 01', 22, 'LIMOUSINE'),
(3, '29A-34567', 'HL Express 01', 45, 'SEAT'),
(3, '29A-34568', 'HL Sleeper 01', 36, 'SLEEPER');

-- Routes
INSERT INTO routes (departure_city, destination_city, distance_km, estimated_hours, base_price) VALUES
('Hà Nội', 'TP. Hồ Chí Minh', 1726, 30.00, 250000),
('TP. Hồ Chí Minh', 'Hà Nội', 1726, 30.00, 250000),
('Hà Nội', 'Đà Nẵng', 764, 14.00, 180000),
('Đà Nẵng', 'Hà Nội', 764, 14.00, 180000),
('TP. Hồ Chí Minh', 'Đà Nẵng', 964, 18.00, 200000),
('Đà Nẵng', 'TP. Hồ Chí Minh', 964, 18.00, 200000),
('TP. Hồ Chí Minh', 'Cần Thơ', 170, 3.50, 80000),
('Cần Thơ', 'TP. Hồ Chí Minh', 170, 3.50, 80000),
('Hà Nội', 'Hải Phòng', 120, 2.50, 70000),
('Hải Phòng', 'Hà Nội', 120, 2.50, 70000);

-- Trips (upcoming trips relative to now)
INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 280000, 45, 'SCHEDULED'),
(1, 2, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 320000, 36, 'SCHEDULED'),
(2, 4, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 275000, 45, 'SCHEDULED'),
(3, 4, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 14 HOUR), 195000, 40, 'SCHEDULED'),
(5, 3, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 18 HOUR), 220000, 20, 'SCHEDULED'),
(7, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 4 HOUR), 90000, 45, 'SCHEDULED'),
(9, 4, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 75000, 38, 'SCHEDULED');


-- ===== CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_users_created ON users(created_at);
CREATE INDEX idx_trips_created ON trips(created_at);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_payments_created ON payments(created_at);

-- Create views for common queries
CREATE VIEW popular_routes AS
SELECT 
    r.route_id,
    r.departure_city,
    r.destination_city,
    COUNT(t.trip_id) as total_trips,
    AVG(t.price) as avg_price,
    COUNT(b.booking_id) as total_bookings
FROM routes r
LEFT JOIN trips t ON r.route_id = t.route_id
LEFT JOIN bookings b ON t.trip_id = b.trip_id
WHERE r.status = 'ACTIVE'
GROUP BY r.route_id
ORDER BY total_bookings DESC;

-- Create view for trip availability
CREATE VIEW trip_availability AS
SELECT 
    t.trip_id,
    t.route_id,
    COUNT(s.seat_id) as total_seats,
    SUM(CASE WHEN s.is_available = TRUE THEN 1 ELSE 0 END) as available_seats,
    SUM(CASE WHEN s.is_available = FALSE THEN 1 ELSE 0 END) as booked_seats
FROM trips t
LEFT JOIN seats s ON t.trip_id = s.trip_id
GROUP BY t.trip_id;
