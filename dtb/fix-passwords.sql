USE miyuki_db;
SET NAMES utf8mb4;

-- Hash của mật khẩu "Demo@123456"
-- Tất cả tài khoản demo dùng cùng mật khẩu
UPDATE users SET password_hash = '$2a$10$pq/WjpnSzasDOuALMX7PFuoxaG3H0trMicg9YkIVur7NY3i.Wj2nC'
WHERE user_id IN (2, 3, 4, 5);

-- Xác nhận
SELECT user_id, email, full_name, 
       SUBSTRING(password_hash, 1, 20) as hash_preview,
       status
FROM users
ORDER BY user_id;
