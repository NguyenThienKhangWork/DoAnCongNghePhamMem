-- MiYuki Express Database Initialization
-- MySQL 8.0

CREATE DATABASE IF NOT EXISTS miyuki_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE miyuki_db;
SET NAMES utf8mb4;

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
-- =====================================================
-- MiYuki Express - Dữ liệu thực tế Việt Nam
-- =====================================================
-- =====================================================
-- XÓA DỮ LIỆU CŨ (giữ schema)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM payments;
DELETE FROM seats;
DELETE FROM bookings;
DELETE FROM trips;
DELETE FROM buses;
DELETE FROM routes;
DELETE FROM bus_companies;
DELETE FROM user_roles;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- USERS - Tài khoản demo
-- =====================================================
-- Mật khẩu: Demo@123456 (BCrypt hash)
INSERT INTO users (user_id, email, phone, full_name, password_hash, status, created_at, updated_at) VALUES
(1,  'demo@miyuki.vn',      '0901234567', 'Nguyễn Văn Demo',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEe9HB5HC', 'ACTIVE', NOW(), NOW()),
(2,  'admin@miyuki.vn',     '0909999888', 'Admin MiYuki',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEe9HB5HC', 'ACTIVE', NOW(), NOW()),
(3,  'lan.anh@gmail.com',   '0912345678', 'Nguyễn Thị Lan Anh',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEe9HB5HC', 'ACTIVE', NOW(), NOW()),
(4,  'minh.quan@gmail.com', '0934567890', 'Trần Minh Quân',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEe9HB5HC', 'ACTIVE', NOW(), NOW()),
(5,  'thu.huong@gmail.com', '0945678901', 'Phạm Thu Hương',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEe9HB5HC', 'ACTIVE', NOW(), NOW());

-- =====================================================
-- ROLES
-- =====================================================
INSERT IGNORE INTO roles (role_id, role_name, description) VALUES
(1, 'CUSTOMER', 'Khách hàng thông thường'),
(2, 'DRIVER',   'Tài xế xe khách'),
(3, 'COMPANY_ADMIN', 'Quản trị nhà xe'),
(4, 'ADMIN',    'Quản trị hệ thống');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), (2, 4), (3, 1), (4, 1), (5, 1);

-- =====================================================
-- NHÀ XE - Thực tế Việt Nam
-- =====================================================
INSERT INTO bus_companies (company_id, company_name, phone, email, address, rating, status, created_at, updated_at) VALUES
(1, 'Phương Trang (FUTA)',  '1900 6067', 'info@futabus.vn',        '467 Lê Hồng Phong, Quận 10, TP.HCM', 4.85, 'ACTIVE', NOW(), NOW()),
(2, 'Thành Bưởi',          '028 3838 3838', 'info@thanhbuoi.vn',   '265 Điện Biên Phủ, Quận 3, TP.HCM',  4.72, 'ACTIVE', NOW(), NOW()),
(3, 'Hoàng Long',          '024 3829 3029', 'info@hoanglongbus.vn','74B Trần Nhân Tông, Hà Nội',          4.68, 'ACTIVE', NOW(), NOW()),
(4, 'Hà Sơn - Hải Vân',   '024 3267 3267', 'info@hasonhaivan.vn', '149 Giảng Võ, Ba Đình, Hà Nội',       4.55, 'ACTIVE', NOW(), NOW()),
(5, 'Kumho Samco',         '028 3932 9292', 'info@kumhosamco.vn',  '37 Hùng Vương, Quận 5, TP.HCM',       4.60, 'ACTIVE', NOW(), NOW()),
(6, 'Sinh Tourist',        '1900 1838',     'info@thesinhtourist.vn','246-248 De Tham, Quận 1, TP.HCM',   4.50, 'ACTIVE', NOW(), NOW()),
(7, 'Mai Linh Express',    '1900 6267',     'info@mailinh.vn',      'Toàn quốc',                           4.45, 'ACTIVE', NOW(), NOW()),
(8, 'Xe khách Sài Gòn',   '028 3845 6789', 'info@saigonbus.vn',   '389 Đinh Tiên Hoàng, Q.Bình Thạnh',   4.40, 'ACTIVE', NOW(), NOW());

-- =====================================================
-- XE KHÁCH - Đầu xe thực tế
-- =====================================================
INSERT INTO buses (bus_id, company_id, registration_plate, bus_name, total_seats, bus_type, year_manufactured, status, created_at, updated_at) VALUES
-- Phương Trang
(1,  1, '51B-333.33', 'Phương Trang - Ghế 45',     45, 'SEAT',      2022, 'ACTIVE', NOW(), NOW()),
(2,  1, '51B-444.44', 'Phương Trang - Giường 40',   40, 'SLEEPER',   2023, 'ACTIVE', NOW(), NOW()),
(3,  1, '51B-555.55', 'Phương Trang Limousine VIP',  22, 'LIMOUSINE', 2024, 'ACTIVE', NOW(), NOW()),
(4,  1, '51B-666.66', 'Phương Trang - Giường 34',   34, 'SLEEPER',   2022, 'ACTIVE', NOW(), NOW()),
-- Thành Bưởi
(5,  2, '51C-111.11', 'Thành Bưởi Ghế VIP',        45, 'SEAT',      2022, 'ACTIVE', NOW(), NOW()),
(6,  2, '51C-222.22', 'Thành Bưởi Limousine 22',    22, 'LIMOUSINE', 2023, 'ACTIVE', NOW(), NOW()),
(7,  2, '51C-333.33', 'Thành Bưởi Giường Đôi',      36, 'SLEEPER',   2021, 'ACTIVE', NOW(), NOW()),
-- Hoàng Long
(8,  3, '29B-111.11', 'Hoàng Long Express 45',      45, 'SEAT',      2022, 'ACTIVE', NOW(), NOW()),
(9,  3, '29B-222.22', 'Hoàng Long Giường nằm',      40, 'SLEEPER',   2023, 'ACTIVE', NOW(), NOW()),
(10, 3, '29B-333.33', 'Hoàng Long Limousine',       18, 'LIMOUSINE', 2024, 'ACTIVE', NOW(), NOW()),
-- Hà Sơn - Hải Vân
(11, 4, '30A-111.11', 'Hà Sơn Ghế ngồi',           45, 'SEAT',      2021, 'ACTIVE', NOW(), NOW()),
(12, 4, '30A-222.22', 'Hà Sơn Giường nằm',          36, 'SLEEPER',   2022, 'ACTIVE', NOW(), NOW()),
-- Kumho Samco
(13, 5, '51D-111.11', 'Kumho Giường đơn',           36, 'SLEEPER',   2023, 'ACTIVE', NOW(), NOW()),
(14, 5, '51D-222.22', 'Kumho Limousine VIP',         22, 'LIMOUSINE', 2024, 'ACTIVE', NOW(), NOW()),
-- Sinh Tourist
(15, 6, '51E-111.11', 'Sinh Tourist Sleeper',       40, 'SLEEPER',   2022, 'ACTIVE', NOW(), NOW()),
(16, 6, '51E-222.22', 'Sinh Tourist VIP',           22, 'LIMOUSINE', 2023, 'ACTIVE', NOW(), NOW()),
-- Mai Linh & Sài Gòn
(17, 7, '51G-111.11', 'Mai Linh Express',           45, 'SEAT',      2021, 'ACTIVE', NOW(), NOW()),
(18, 8, '51H-111.11', 'Sài Gòn Giường nằm',        40, 'SLEEPER',   2022, 'ACTIVE', NOW(), NOW());

-- =====================================================
-- TUYẾN ĐƯỜNG - Thực tế Việt Nam
-- =====================================================
INSERT INTO routes (route_id, departure_city, destination_city, distance_km, estimated_hours, base_price, status, created_at) VALUES
-- Bắc - Nam
(1,  'Ha Noi',       'TP. Ho Chi Minh', 1726, 32.00, 350000, 'ACTIVE', NOW()),
(2,  'TP. Ho Chi Minh', 'Ha Noi',       1726, 32.00, 350000, 'ACTIVE', NOW()),
-- Miền Bắc
(3,  'Ha Noi',       'Da Nang',         763,  14.00, 220000, 'ACTIVE', NOW()),
(4,  'Da Nang',      'Ha Noi',          763,  14.00, 220000, 'ACTIVE', NOW()),
(5,  'Ha Noi',       'Hai Phong',       120,  2.50,  70000,  'ACTIVE', NOW()),
(6,  'Hai Phong',    'Ha Noi',          120,  2.50,  70000,  'ACTIVE', NOW()),
(7,  'Ha Noi',       'Ninh Binh',       95,   2.00,  60000,  'ACTIVE', NOW()),
(8,  'Ha Noi',       'Sa Pa',           380,  6.00,  150000, 'ACTIVE', NOW()),
(9,  'Ha Noi',       'Ha Long',         170,  3.50,  100000, 'ACTIVE', NOW()),
(10, 'Ha Long',      'Ha Noi',          170,  3.50,  100000, 'ACTIVE', NOW()),
-- Miền Trung
(11, 'Da Nang',      'Hue',             100,  2.50,  80000,  'ACTIVE', NOW()),
(12, 'Hue',          'Da Nang',         100,  2.50,  80000,  'ACTIVE', NOW()),
(13, 'Da Nang',      'Hoi An',          30,   1.00,  35000,  'ACTIVE', NOW()),
(14, 'Hoi An',       'Da Nang',         30,   1.00,  35000,  'ACTIVE', NOW()),
(15, 'Da Nang',      'TP. Ho Chi Minh', 964,  16.00, 280000, 'ACTIVE', NOW()),
(16, 'TP. Ho Chi Minh', 'Da Nang',      964,  16.00, 280000, 'ACTIVE', NOW()),
(17, 'Hue',          'TP. Ho Chi Minh', 1064, 18.00, 300000, 'ACTIVE', NOW()),
(18, 'Da Nang',      'Quy Nhon',        305,  6.00,  150000, 'ACTIVE', NOW()),
(19, 'Da Nang',      'Nha Trang',       530,  9.00,  200000, 'ACTIVE', NOW()),
-- Miền Nam
(20, 'TP. Ho Chi Minh', 'Vung Tau',     125,  2.50,  90000,  'ACTIVE', NOW()),
(21, 'Vung Tau',     'TP. Ho Chi Minh', 125,  2.50,  90000,  'ACTIVE', NOW()),
(22, 'TP. Ho Chi Minh', 'Can Tho',      170,  3.50,  100000, 'ACTIVE', NOW()),
(23, 'Can Tho',      'TP. Ho Chi Minh', 170,  3.50,  100000, 'ACTIVE', NOW()),
(24, 'TP. Ho Chi Minh', 'Da Lat',       308,  7.00,  160000, 'ACTIVE', NOW()),
(25, 'Da Lat',       'TP. Ho Chi Minh', 308,  7.00,  160000, 'ACTIVE', NOW()),
(26, 'TP. Ho Chi Minh', 'Nha Trang',    447,  9.00,  220000, 'ACTIVE', NOW()),
(27, 'Nha Trang',    'TP. Ho Chi Minh', 447,  9.00,  220000, 'ACTIVE', NOW()),
(28, 'TP. Ho Chi Minh', 'Phan Thiet',   198,  4.00,  120000, 'ACTIVE', NOW()),
(29, 'TP. Ho Chi Minh', 'Quy Nhon',     655, 12.00,  250000, 'ACTIVE', NOW()),
(30, 'TP. Ho Chi Minh', 'Tay Ninh',     100,  2.50,  65000,  'ACTIVE', NOW());

-- =====================================================
-- CHUYẾN ĐI - Trong 3 ngày tới (thực tế)
-- =====================================================
INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status, created_at, updated_at) VALUES

-- HÀ NỘI → TP. HCM (route 1)
(1, 2,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,   DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 380000, 28, 'SCHEDULED', NOW(), NOW()),
(1, 4,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR,  DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 2 HOUR,  420000, 20, 'SCHEDULED', NOW(), NOW()),
(1, 3,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR,   DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 15 HOUR, 650000, 12, 'SCHEDULED', NOW(), NOW()),
(1, 9,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 19 HOUR,  DATE_ADD(CURDATE(), INTERVAL 4 DAY) + INTERVAL 3 HOUR,  390000, 32, 'SCHEDULED', NOW(), NOW()),
(1, 2,  DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 6 HOUR,   DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 14 HOUR, 380000, 36, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → HÀ NỘI (route 2)
(2, 7,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR,   DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 16 HOUR, 370000, 24, 'SCHEDULED', NOW(), NOW()),
(2, 15, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR,  DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 3 HOUR,  400000, 30, 'SCHEDULED', NOW(), NOW()),
(2, 6,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 9 HOUR,   DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 17 HOUR, 680000, 10, 'SCHEDULED', NOW(), NOW()),

-- HÀ NỘI → ĐÀ NẴNG (route 3)
(3, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, 230000, 38, 'SCHEDULED', NOW(), NOW()),
(3, 9,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 8 HOUR,  250000, 28, 'SCHEDULED', NOW(), NOW()),
(3, 10, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 8 HOUR,   DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 450000, 12, 'SCHEDULED', NOW(), NOW()),
(3, 12, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 19 HOUR,  DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 9 HOUR,  260000, 22, 'SCHEDULED', NOW(), NOW()),

-- ĐÀ NẴNG → HÀ NỘI (route 4)
(4, 11, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, 225000, 40, 'SCHEDULED', NOW(), NOW()),
(4, 12, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 20 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 255000, 26, 'SCHEDULED', NOW(), NOW()),

-- HÀ NỘI → HẢI PHÒNG (route 5) - ngắn, nhiều chuyến
(5, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 75000, 42, 'SCHEDULED', NOW(), NOW()),
(5, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR + INTERVAL 30 MINUTE, 75000, 40, 'SCHEDULED', NOW(), NOW()),
(5, 11, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 13 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 15 HOUR + INTERVAL 30 MINUTE, 75000, 38, 'SCHEDULED', NOW(), NOW()),
(5, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 17 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 75000, 44, 'SCHEDULED', NOW(), NOW()),

-- HÀ NỘI → HẠ LONG (route 9)
(9, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 110000, 40, 'SCHEDULED', NOW(), NOW()),
(9, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR + INTERVAL 30 MINUTE, 110000, 38, 'SCHEDULED', NOW(), NOW()),
(9, 11, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR,   DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 115000, 36, 'SCHEDULED', NOW(), NOW()),

-- ĐÀ NẴNG → HUẾ (route 11)
(11, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 85000, 42, 'SCHEDULED', NOW(), NOW()),
(11, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR + INTERVAL 30 MINUTE, 85000, 40, 'SCHEDULED', NOW(), NOW()),
(11, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR + INTERVAL 30 MINUTE, 90000, 38, 'SCHEDULED', NOW(), NOW()),

-- ĐÀ NẴNG → HỘI AN (route 13) - rất nhiều chuyến
(13, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  40000, 44, 'SCHEDULED', NOW(), NOW()),
(13, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR,  40000, 42, 'SCHEDULED', NOW(), NOW()),
(13, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 40000, 40, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → VŨNG TÀU (route 20)
(20, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 95000, 43, 'SCHEDULED', NOW(), NOW()),
(20, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR + INTERVAL 30 MINUTE, 95000, 40, 'SCHEDULED', NOW(), NOW()),
(20, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 95000, 38, 'SCHEDULED', NOW(), NOW()),
(20, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 95000, 35, 'SCHEDULED', NOW(), NOW()),
(20, 8,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 6 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 95000, 42, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → CẦN THƠ (route 22)
(22, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 105000, 42, 'SCHEDULED', NOW(), NOW()),
(22, 18, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR + INTERVAL 30 MINUTE, 115000, 28, 'SCHEDULED', NOW(), NOW()),
(22, 7,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR + INTERVAL 30 MINUTE, 105000, 34, 'SCHEDULED', NOW(), NOW()),
(22, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 105000, 38, 'SCHEDULED', NOW(), NOW()),
(22, 6,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 195000, 14, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → ĐÀ LẠT (route 24)
(24, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 165000, 40, 'SCHEDULED', NOW(), NOW()),
(24, 7,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 2 HOUR,  185000, 30, 'SCHEDULED', NOW(), NOW()),
(24, 6,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 380000, 16, 'SCHEDULED', NOW(), NOW()),
(24, 18, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 3 HOUR,  175000, 28, 'SCHEDULED', NOW(), NOW()),
(24, 15, DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 8 HOUR,  DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 15 HOUR, 185000, 32, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → NHA TRANG (route 26)
(26, 7,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 230000, 28, 'SCHEDULED', NOW(), NOW()),
(26, 14, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 4 HOUR,  450000, 16, 'SCHEDULED', NOW(), NOW()),
(26, 18, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 8 HOUR,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 235000, 32, 'SCHEDULED', NOW(), NOW()),
(26, 15, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 5 HOUR,  250000, 24, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → PHAN THIẾT (route 28)
(28, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 130000, 40, 'SCHEDULED', NOW(), NOW()),
(28, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 130000, 38, 'SCHEDULED', NOW(), NOW()),
(28, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 130000, 42, 'SCHEDULED', NOW(), NOW()),

-- ĐÀ NẴNG → NHA TRANG (route 19)
(19, 8,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 210000, 38, 'SCHEDULED', NOW(), NOW()),
(19, 9,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 4 HOUR,  225000, 28, 'SCHEDULED', NOW(), NOW()),

-- HÀ NỘI → SA PA (route 8)
(8, 9,   DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 3 HOUR,  175000, 36, 'SCHEDULED', NOW(), NOW()),
(8, 12,  DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 4 HOUR,  185000, 28, 'SCHEDULED', NOW(), NOW()),

-- TP. HCM → TÂY NINH (route 30)
(30, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 70000, 44, 'SCHEDULED', NOW(), NOW()),
(30, 1,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 70000, 42, 'SCHEDULED', NOW(), NOW()),
(30, 5,  DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 13 HOUR + INTERVAL 30 MINUTE, 70000, 40, 'SCHEDULED', NOW(), NOW()),
(30, 17, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 70000, 38, 'SCHEDULED', NOW(), NOW());

SELECT CONCAT('✅ Đã thêm dữ liệu: ', COUNT(*), ' chuyến đi') as result FROM trips;
SELECT CONCAT('✅ Routes: ', COUNT(*), ' tuyến đường') as result FROM routes;
SELECT CONCAT('✅ Users: ', COUNT(*), ' tài khoản') as result FROM users;
USE miyuki_db;
SET NAMES utf8mb4;

-- Tạo ghế cho tất cả trips hiện có
-- Mỗi trip: tạo ghế theo total_seats của bus
DELIMITER //

DROP PROCEDURE IF EXISTS create_seats_for_trips//

CREATE PROCEDURE create_seats_for_trips()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_trip_id BIGINT;
    DECLARE v_total_seats INT;
    DECLARE v_bus_type VARCHAR(20);
    DECLARE i INT;
    DECLARE seat_label VARCHAR(10);
    DECLARE seat_type VARCHAR(20);
    
    DECLARE cur CURSOR FOR 
        SELECT t.trip_id, b.total_seats, b.bus_type
        FROM trips t
        JOIN buses b ON t.bus_id = b.bus_id
        WHERE t.trip_id NOT IN (SELECT DISTINCT trip_id FROM seats);
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_trip_id, v_total_seats, v_bus_type;
        IF done THEN LEAVE read_loop; END IF;
        
        SET i = 1;
        WHILE i <= v_total_seats DO
            -- Tạo số ghế: A1-A4, B1-B4, ...
            SET seat_label = CONCAT(
                CHAR(64 + CEIL(i/4)),
                ((i-1) MOD 4) + 1
            );
            
            -- Loại ghế dựa vào bus type và vị trí
            IF v_bus_type = 'LIMOUSINE' THEN
                SET seat_type = 'VIP';
            ELSEIF v_bus_type = 'SLEEPER' THEN
                SET seat_type = 'REGULAR';
            ELSEIF i MOD 4 = 2 OR i MOD 4 = 3 THEN
                SET seat_type = 'WINDOW';
            ELSE
                SET seat_type = 'REGULAR';
            END IF;
            
            INSERT IGNORE INTO seats (trip_id, seat_number, seat_type, is_available, created_at)
            VALUES (v_trip_id, seat_label, seat_type, TRUE, NOW());
            
            SET i = i + 1;
        END WHILE;
    END LOOP;
    
    CLOSE cur;
END//

DELIMITER ;

CALL create_seats_for_trips();

SELECT CONCAT('Tong so ghe da tao: ', COUNT(*)) as result FROM seats;
SELECT trip_id, COUNT(*) as seat_count FROM seats GROUP BY trip_id ORDER BY trip_id LIMIT 5;
-- =================================================================
-- MiYuki Express - Dữ liệu ảo: booking_details, reviews,
--                               notifications, refunds
--                 + 63 tỉnh thành Việt Nam (routes + trips)
-- =================================================================
USE miyuki_db;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- =================================================================
-- 0. BOOKINGS (dữ liệu đặt vé - chèn trước booking_details)
-- =================================================================
-- booking 2: lan.anh (user 3), trip 45 (HCM→NhaTrang, 250k), 2 ghế = 500k, chưa TT
-- booking 3: lan.anh (user 3), trip 25 (DN→HoiAn, 40k), 1 ghế = 40k, chưa TT (đã hoàn tiền)
-- booking 4: minh.quan (user 4), trip 10 (HN→DN, 250k), 2 ghế = 500k, đã TT
-- booking 5: thu.huong (user 5), trip 28 (HCM→VungTau, 95k), 3 ghế = 285k, đã TT
-- booking 6: lan.anh (user 3), trip 48 (HCM→PhanThiet, 130k), 1 ghế = 130k, đã TT
-- booking 7: demo (user 1), trip 22 (DN→Hue, 90k), 2 ghế = 180k, chưa TT (chờ hoàn tiền)
-- booking 8: demo (user 1), trip 35 (HCM→CanTho, 105k), 1 ghế = 105k, chưa TT
-- booking 9: admin (user 2), trip 9 (HN→DN, 230k), 1 ghế = 230k, đã TT
INSERT INTO bookings
  (booking_id, user_id, trip_id, booking_code, booking_status, total_price, payment_status, departure_date, created_at, updated_at)
VALUES
(2, 3, 45, 'MKE05E3AD6',  'PENDING',   500000.00, 'UNPAID',   DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(3, 3, 25, 'MK218A6896',  'CANCELLED', 40000.00,  'REFUNDED', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(4, 4, 10, 'MKFEB1A535',  'CONFIRMED', 500000.00, 'PAID',     DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(5, 5, 28, 'MK693589B3',  'CONFIRMED', 285000.00, 'PAID',     DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(6, 3, 48, 'MKDC151A85',  'CONFIRMED', 130000.00, 'PAID',     DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(7, 1, 22, 'MKD4CEB470',  'PENDING',   180000.00, 'UNPAID',   DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(8, 1, 35, 'MK8F3A2B1C',  'PENDING',   105000.00, 'UNPAID',   DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
(9, 2, 9,  'MK9D4E5F6A',  'CONFIRMED', 230000.00, 'PAID',     DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW());

-- =================================================================
-- 1. BOOKING DETAILS (hành khách cho từng ghế)
-- =================================================================
-- booking 2: lan.anh, trip 45, seats 632(A1) 633(A2)
INSERT IGNORE INTO booking_details
  (booking_id, seat_id, passenger_name, passenger_phone, passenger_email, identification_number)
VALUES
(2, 632, 'Nguyen Thi Lan Anh', '0912345678', 'lan.anh@gmail.com', '079200012345'),
(2, 633, 'Nguyen Van Tuan',    '0912345679', NULL,               '079200012346'),

-- booking 4: minh.quan, trip 10, seats 396(A1) 397(A2)
(4, 396, 'Tran Minh Quan',     '0934567890', 'minh.quan@gmail.com', '074300056789'),
(4, 397, 'Tran Thi Mai',       '0934567891', NULL,                  '074300056790'),

-- booking 5: thu.huong, trip 28, seats 1560(A1) 1561(A2) 1562(A3)
(5, 1560, 'Pham Thu Huong',    '0945678901', 'thu.huong@gmail.com', '001199034567'),
(5, 1561, 'Pham Quoc Hung',    '0945678902', NULL,                  '001199034568'),
(5, 1562, 'Pham Thi Ngoc',     '0945678903', NULL,                  '001199034569'),

-- booking 6: lan.anh, trip 48, seat 2210(A1)
(6, 2210, 'Nguyen Thi Lan Anh','0912345678', 'lan.anh@gmail.com', '079200012345'),

-- booking 8: demo, trip 35, seat 463(C4)
(8, 463, 'Nguyen Van Demo',    '0901234567', 'demo@miyuki.vn',    '024100099999'),

-- booking 9: admin, trip 9, seat 431(D2)
(9, 431, 'Admin MiYuki',       '0909999888', 'admin@miyuki.vn',   '001100088888');

-- =================================================================
-- 2. REVIEWS (đánh giá sau chuyến đi)
-- =================================================================
INSERT IGNORE INTO reviews
  (booking_id, user_id, trip_id, rating, comment)
VALUES
-- lan.anh đánh giá chuyến HCM->DaLat (booking 2, trip 45)
(2, 3, 45, 5,
 'Xe chạy đúng giờ, tài xế lái rất chuyên nghiệp. Ghế ngồi thoải mái, điều hòa mát. Sẽ đặt lại lần sau!'),

-- lan.anh đánh giá chuyến HCM->NhaTrang (booking 6, trip 48)
(6, 3, 48, 4,
 'Chuyến đi ổn, xe sạch sẽ. Chỉ hơi trễ 15 phút so với lịch nhưng không sao. Nhân viên thân thiện.'),

-- minh.quan đánh giá chuyến HN->DaNang (booking 4, trip 10)
(4, 4, 10, 5,
 'Đặt vé qua MiYuki rất tiện lợi, không cần ra bến xe. Xe giường nằm rất êm, ngủ ngon suốt chuyến!'),

-- thu.huong đánh giá chuyến HCM->VungTau (booking 5, trip 28)
(5, 5, 28, 4,
 'Tuyến HCM - Vũng Tàu tiện lợi, xe đông nhưng vẫn có ghế. Chỉ cần cải thiện việc đón khách đúng điểm hơn.');

-- =================================================================
-- 3. NOTIFICATIONS (thông báo hệ thống)
-- =================================================================
INSERT INTO notifications
  (user_id, booking_id, notification_type, title, message, is_read)
VALUES
-- Xác nhận vé
(3, 2, 'BOOKING_CONFIRMED',
 'Vé đã được xác nhận',
 'Vé MKE05E3AD6 của bạn đã được xác nhận. Chuyến TP. HCM → Đà Lạt khởi hành lúc 07:00 ngày mai.',
 TRUE),

(3, 6, 'BOOKING_CONFIRMED',
 'Vé đã được xác nhận',
 'Vé MKDC151A85 của bạn đã được xác nhận. Chuyến TP. HCM → Nha Trang khởi hành tối mai.',
 TRUE),

(4, 4, 'BOOKING_CONFIRMED',
 'Vé đã được xác nhận',
 'Vé MKFEB1A535 của bạn đã được xác nhận. Chuyến Hà Nội → Đà Nẵng khởi hành ngày mai.',
 TRUE),

(5, 5, 'BOOKING_CONFIRMED',
 'Vé đã được xác nhận',
 'Vé MK693589B3 của bạn đã được xác nhận. Chuyến TP. HCM → Vũng Tàu khởi hành lúc 09:00.',
 TRUE),

-- Nhắc nhở chuyến đi
(3, 2, 'TRIP_REMINDER',
 'Nhắc nhở: Chuyến đi của bạn sắp khởi hành',
 'Chuyến TP. HCM → Đà Lạt của bạn sẽ khởi hành trong 2 giờ nữa. Vui lòng có mặt trước 30 phút.',
 TRUE),

(4, 4, 'TRIP_REMINDER',
 'Nhắc nhở: Chuyến đi Hà Nội → Đà Nẵng',
 'Xe sẽ đón bạn tại bến xe Mỹ Đình lúc 19:00. Vui lòng mang theo CMND/CCCD và mã vé.',
 FALSE),

-- Khuyến mãi
(3, NULL, 'PROMOTION',
 'Ưu đãi đặc biệt cuối tuần 🎉',
 'Giảm 20% cho tất cả chuyến TP. HCM → Đà Lạt vào thứ 7 và Chủ nhật. Đặt ngay hôm nay!',
 FALSE),

(4, NULL, 'PROMOTION',
 'Flash Sale: Hà Nội → Hạ Long chỉ 99k 🔥',
 'Chỉ còn 20 vé với giá đặc biệt 99,000đ cho tuyến Hà Nội - Hạ Long. Áp dụng đến 23:59 hôm nay.',
 FALSE),

(5, NULL, 'PROMOTION',
 'Tích điểm MiYuki - Nhận ưu đãi ngay',
 'Bạn đã tích lũy đủ 500 điểm. Đổi ngay để nhận giảm giá 50,000đ cho chuyến đi tiếp theo!',
 FALSE),

(6, NULL, 'PROMOTION',
 'Chào mừng bạn đến với MiYuki Express! 🌸',
 'Đặt chuyến đầu tiên và nhận ngay mã giảm giá MIYUKI10 - giảm 10% cho mọi tuyến đường.',
 FALSE),

-- Thông báo hoàn tiền
(3, 3, 'REFUND_PROCESSED',
 'Yêu cầu hoàn tiền đã được xử lý',
 'Yêu cầu hoàn tiền cho vé MK218A6896 đã được chấp thuận. 40,000đ sẽ được hoàn vào tài khoản trong 3-5 ngày làm việc.',
 FALSE),

-- Hệ thống
(3, NULL, 'SYSTEM',
 'Cập nhật ứng dụng MiYuki v2.5',
 'Phiên bản mới đã có tính năng theo dõi xe thời gian thực và đặt chỗ yêu thích. Cập nhật ngay!',
 TRUE),

(6, NULL, 'SYSTEM',
 'Bảo trì hệ thống thông báo',
 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày mai. Vui lòng hoàn thành đặt vé trước thời gian này.',
 TRUE);

-- =================================================================
-- 4. REFUNDS (hoàn tiền)
-- =================================================================
INSERT INTO refunds
  (booking_id, payment_id, refund_amount, refund_reason, refund_status)
VALUES
-- Booking 3 (MK218A6896 - PENDING/UNPAID) - yêu cầu hủy
(3, NULL, 40000.00,
 'Khách hàng đổi lịch, yêu cầu hủy chuyến Đà Nẵng → Hội An',
 'COMPLETED'),

-- Booking 7 (MKD4CEB470 - PENDING/UNPAID) - yêu cầu hủy một phần
(7, NULL, 185000.00,
 'Khách hàng không thể đi do công việc đột xuất',
 'PENDING'),

-- Booking 8 (demo) - đang xử lý
(8, NULL, 90000.00,
 'Xe bị hủy chuyến do sự cố kỹ thuật',
 'APPROVED');

-- =================================================================
-- 5. 63 TỈNH THÀNH VIỆT NAM - Thêm routes còn thiếu
-- =================================================================

-- Thêm các tỉnh thành chưa có trong routes
INSERT IGNORE INTO routes
  (departure_city, destination_city, distance_km, estimated_hours, base_price, status)
VALUES
-- TP.HCM kết nối các tỉnh miền Nam
('TP. Ho Chi Minh', 'Long An',         47,  1.50,  45000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Tien Giang',      70,  2.00,  55000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Ben Tre',        100,  2.50,  75000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Dong Nai',        30,  1.00,  40000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Binh Duong',      30,  1.00,  40000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Ba Ria - Vung Tau', 120, 2.50, 90000, 'ACTIVE'),
('TP. Ho Chi Minh', 'Tay Ninh',       100,  2.50,  65000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Binh Phuoc',     120,  2.50,  80000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Soc Trang',      230,  5.00, 140000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Bac Lieu',       280,  6.00, 160000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Ca Mau',         350,  7.50, 190000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Kien Giang',     250,  5.50, 150000,  'ACTIVE'),
('TP. Ho Chi Minh', 'An Giang',       230,  5.00, 140000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Dong Thap',      160,  3.50, 100000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Vinh Long',      140,  3.00,  90000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Tra Vinh',       160,  3.50, 100000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Hau Giang',      240,  5.00, 145000,  'ACTIVE'),

-- Hà Nội kết nối miền Bắc
('Ha Noi', 'Bac Ninh',      30,  1.00,  40000,  'ACTIVE'),
('Ha Noi', 'Hung Yen',      50,  1.50,  50000,  'ACTIVE'),
('Ha Noi', 'Vinh Phuc',     60,  1.50,  55000,  'ACTIVE'),
('Ha Noi', 'Ha Nam',        60,  1.50,  55000,  'ACTIVE'),
('Ha Noi', 'Nam Dinh',      90,  2.00,  65000,  'ACTIVE'),
('Ha Noi', 'Thai Binh',    110,  2.50,  70000,  'ACTIVE'),
('Ha Noi', 'Thai Nguyen',   80,  2.00,  60000,  'ACTIVE'),
('Ha Noi', 'Bac Giang',     60,  1.50,  55000,  'ACTIVE'),
('Ha Noi', 'Bac Kan',      170,  3.50, 100000,  'ACTIVE'),
('Ha Noi', 'Cao Bang',     280,  6.00, 160000,  'ACTIVE'),
('Ha Noi', 'Lang Son',     170,  3.50, 100000,  'ACTIVE'),
('Ha Noi', 'Quang Ninh',   160,  3.50, 100000,  'ACTIVE'),
('Ha Noi', 'Hoa Binh',      75,  2.00,  60000,  'ACTIVE'),
('Ha Noi', 'Phu Tho',      80,  2.00,  60000,  'ACTIVE'),
('Ha Noi', 'Tuyen Quang',  165,  3.50, 100000,  'ACTIVE'),
('Ha Noi', 'Yen Bai',      185,  4.00, 110000,  'ACTIVE'),
('Ha Noi', 'Lao Cai',      350,  7.00, 180000,  'ACTIVE'),
('Ha Noi', 'Ha Giang',     330,  7.00, 175000,  'ACTIVE'),
('Ha Noi', 'Son La',       330,  7.00, 175000,  'ACTIVE'),
('Ha Noi', 'Lai Chau',     450,  9.00, 220000,  'ACTIVE'),
('Ha Noi', 'Dien Bien',    480, 10.00, 240000,  'ACTIVE'),

-- Miền Trung
('Da Nang', 'Quang Nam',    50,  1.50,  50000,  'ACTIVE'),
('Da Nang', 'Quang Ngai',  130,  2.50,  80000,  'ACTIVE'),
('Da Nang', 'Binh Dinh',   270,  5.00, 150000,  'ACTIVE'),
('Da Nang', 'Phu Yen',     380,  7.00, 180000,  'ACTIVE'),
('Hue', 'Quang Tri',        60,  1.50,  55000,  'ACTIVE'),
('Hue', 'Quang Binh',      170,  3.50, 100000,  'ACTIVE'),
('Ha Noi', 'Nghe An',      300,  6.00, 165000,  'ACTIVE'),
('Ha Noi', 'Ha Tinh',      350,  7.00, 185000,  'ACTIVE'),

-- Tây Nguyên
('TP. Ho Chi Minh', 'Dak Lak',       350,  7.00, 185000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Dak Nong',      270,  5.50, 155000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Gia Lai',       520, 10.00, 240000,  'ACTIVE'),
('TP. Ho Chi Minh', 'Kon Tum',       540, 11.00, 255000,  'ACTIVE'),
('Da Nang', 'Kon Tum',               200,  4.00, 120000,  'ACTIVE'),
('Da Nang', 'Gia Lai',               250,  5.00, 145000,  'ACTIVE');

-- =================================================================
-- 6. TRIPS cho các tuyến mới (3 ngày tới)
-- =================================================================
-- Lấy route_id của các tuyến vừa thêm và tạo trips
INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status)
SELECT r.route_id, b.bus_id,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 7 HOUR + INTERVAL r.estimated_hours HOUR,
       r.base_price * 1.1,
       b.total_seats,
       'SCHEDULED'
FROM routes r
JOIN buses b ON b.bus_id = 1
WHERE r.departure_city = 'TP. Ho Chi Minh'
  AND r.route_id > 30
LIMIT 10;

INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status)
SELECT r.route_id, b.bus_id,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR + INTERVAL r.estimated_hours HOUR,
       r.base_price * 1.15,
       b.total_seats,
       'SCHEDULED'
FROM routes r
JOIN buses b ON b.bus_id = 5
WHERE r.departure_city = 'TP. Ho Chi Minh'
  AND r.route_id > 30
LIMIT 10;

INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status)
SELECT r.route_id, b.bus_id,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR,
       DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 6 HOUR + INTERVAL r.estimated_hours HOUR,
       r.base_price * 1.1,
       b.total_seats,
       'SCHEDULED'
FROM routes r
JOIN buses b ON b.bus_id = 8
WHERE r.departure_city = 'Ha Noi'
  AND r.route_id > 30
LIMIT 15;

INSERT INTO trips (route_id, bus_id, departure_time, arrival_time, price, available_seats, status)
SELECT r.route_id, b.bus_id,
       DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR,
       DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 7 HOUR + INTERVAL r.estimated_hours HOUR,
       r.base_price * 1.1,
       b.total_seats,
       'SCHEDULED'
FROM routes r
JOIN buses b ON b.bus_id = 11
WHERE r.departure_city IN ('Da Nang', 'Hue')
  AND r.route_id > 30
LIMIT 10;

-- =================================================================
-- 7. SEATS cho trips mới
-- =================================================================
CALL create_seats_for_trips();

SET foreign_key_checks = 1;

-- =================================================================
-- KIỂM TRA KẾT QUẢ
-- =================================================================
SELECT 'booking_details' t, COUNT(*) n FROM booking_details
UNION ALL SELECT 'reviews',       COUNT(*) FROM reviews
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'refunds',       COUNT(*) FROM refunds
UNION ALL SELECT 'routes',        COUNT(*) FROM routes
UNION ALL SELECT 'trips',         COUNT(*) FROM trips
UNION ALL SELECT 'seats',         COUNT(*) FROM seats;
USE miyuki_db;
SET NAMES utf8mb4;

-- Hash của mật khẩu "Demo@123456"
-- Tất cả tài khoản demo dùng cùng mật khẩu
UPDATE users SET password_hash = '$2a$10$pq/WjpnSzasDOuALMX7PFuoxaG3H0trMicg9YkIVur7NY3i.Wj2nC'
WHERE user_id IN (1, 2, 3, 4, 5);

-- Xác nhận
SELECT user_id, email, full_name, 
       SUBSTRING(password_hash, 1, 20) as hash_preview,
       status
FROM users
ORDER BY user_id;