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
