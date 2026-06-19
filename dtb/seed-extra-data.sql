-- =================================================================
-- MiYuki Express - Dữ liệu ảo: booking_details, reviews,
--                               notifications, refunds
--                 + 63 tỉnh thành Việt Nam (routes + trips)
-- =================================================================
USE miyuki_db;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

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
 'Flash Sale: Hà Nội → Hạ Long chỉ 99k 🚌',
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
