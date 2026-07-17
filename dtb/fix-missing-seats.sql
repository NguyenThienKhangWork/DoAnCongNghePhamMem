-- Tạo ghế cho các trip bị thiếu (tạo trước khi có fix tự động)
-- Trip 118: SEAT, 45 ghế → 5 VIP (A1-A4,B1), 9 WINDOW (B2-B4,C1-C4,D1), 31 REGULAR còn lại
-- Trip 119: SLEEPER, 40 ghế → tất cả VIP
-- Trip 120: SEAT, 45 ghế
-- Trip 121: SEAT, 45 ghế

-- ===== Helper procedure =====
DROP PROCEDURE IF EXISTS generate_seats;

DELIMITER //
CREATE PROCEDURE generate_seats(IN p_trip_id BIGINT, IN p_bus_type VARCHAR(20), IN p_total INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE seat_num VARCHAR(10);
    DECLARE seat_type VARCHAR(20);
    DECLARE vip_count INT;
    DECLARE win_count INT;
    DECLARE row_idx INT;
    DECLARE col_idx INT;
    DECLARE row_char CHAR(1);

    SET vip_count = GREATEST(1, CEIL(p_total * 0.10));
    SET win_count = GREATEST(1, CEIL(p_total * 0.20));

    WHILE i <= p_total DO
        -- Tính tên ghế: A1,A2,A3,A4,B1,...
        SET row_idx = FLOOR((i - 1) / 4);
        SET col_idx = MOD(i - 1, 4) + 1;
        SET row_char = CHAR(65 + row_idx); -- 65 = ASCII 'A'
        SET seat_num = CONCAT(row_char, col_idx);

        -- Phân loại ghế
        IF p_bus_type IN ('LIMOUSINE', 'SLEEPER') THEN
            SET seat_type = 'VIP';
        ELSEIF i <= vip_count THEN
            SET seat_type = 'VIP';
        ELSEIF i <= vip_count + win_count THEN
            SET seat_type = 'WINDOW';
        ELSE
            SET seat_type = 'REGULAR';
        END IF;

        INSERT INTO seats (trip_id, seat_number, seat_type, is_available, created_at)
        VALUES (p_trip_id, seat_num, seat_type, TRUE, NOW());

        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- ===== Chạy cho từng trip thiếu ghế =====
CALL generate_seats(118, 'SEAT',    45);
CALL generate_seats(119, 'SLEEPER', 40);
CALL generate_seats(120, 'SEAT',    45);
CALL generate_seats(121, 'SEAT',    45);

-- Dọn dẹp
DROP PROCEDURE IF EXISTS generate_seats;

SELECT trip_id, COUNT(*) as seats_created FROM seats
WHERE trip_id IN (118,119,120,121)
GROUP BY trip_id;
