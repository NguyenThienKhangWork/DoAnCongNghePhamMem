-- =====================================================
-- MiYuki Express - Dữ liệu thực tế Việt Nam
-- =====================================================
USE miyuki_db;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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
(7,  2, '51C-333.33', 'Thành Bưởi Giường đôi',      36, 'SLEEPER',   2021, 'ACTIVE', NOW(), NOW()),
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
