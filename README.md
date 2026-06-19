# 🌸 MiYuki Express — Hệ Thống Đặt Vé Xe Khách Việt Nam

<div align="center">

![MiYuki Express](https://img.shields.io/badge/MiYuki-Express-ff6eb4?style=for-the-badge&logo=bus&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Ứng dụng đặt vé xe khách trực tuyến toàn quốc — Full-stack với Spring Boot + React + MySQL**

</div>

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tính Năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy](#-cài-đặt--chạy)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Tài Khoản Demo](#-tài-khoản-demo)
- [Dữ Liệu Demo](#-dữ-liệu-demo)
- [Luồng Sử Dụng](#-luồng-sử-dụng-chính)
- [Tác Giả](#-tác-giả)

---

## 🎯 Tổng Quan

**MiYuki Express** là hệ thống đặt vé xe khách trực tuyến cho thị trường Việt Nam, được phát triển như đồ án môn Công Nghệ Phần Mềm. Hệ thống cho phép khách hàng tìm kiếm chuyến xe, chọn ghế, đặt vé và quản lý hành trình; đồng thời cung cấp trang quản trị cho admin.

Giao diện theo phong cách **anime/kawaii** với màu sakura hồng-tím trên nền dark, lấy cảm hứng từ các nhân vật anime Nhật Bản.

---

## ✨ Tính Năng

### 👤 Khách Hàng
| Tính năng | Mô tả |
|-----------|-------|
| 🔍 **Tìm kiếm chuyến** | Tìm theo điểm đi, điểm đến, ngày khởi hành — 30 tuyến đường toàn quốc |
| 🪑 **Chọn ghế** | Sơ đồ ghế trực quan (REGULAR / VIP / WINDOW), chọn tối đa 5 ghế |
| 🎫 **Đặt vé & Thanh toán** | Tạo booking + payment, nhận mã đặt vé duy nhất |
| 📋 **Quản lý vé** | Xem danh sách vé, lọc theo trạng thái (PENDING / CONFIRMED / CANCELLED) |
| ❌ **Hủy vé** | Hủy vé và khởi tạo quy trình hoàn tiền |
| ⭐ **Đánh giá** | Review chuyến đi 1–5 sao sau khi hoàn thành |
| 🔔 **Thông báo** | Nhận thông báo về trạng thái vé |
| 👤 **Hồ sơ cá nhân** | Xem/cập nhật thông tin, đổi mật khẩu |

### 🛡️ Quản Trị (Admin)
| Tính năng | Mô tả |
|-----------|-------|
| 📊 **Dashboard** | Thống kê tổng quan: người dùng, chuyến đi, đặt vé, doanh thu |
| 👥 **Quản lý Users** | Xem danh sách, kích hoạt/khóa tài khoản |
| 🚌 **Quản lý Chuyến đi** | CRUD chuyến đi, cập nhật trạng thái |
| 📑 **Quản lý Bookings** | Xem tất cả đơn đặt vé, thống kê chi tiết |
| 🗺️ **Quản lý Tuyến đường** | Xem danh sách tuyến đường |
| 💸 **Xử lý Hoàn tiền** | Duyệt/từ chối yêu cầu hoàn tiền |
| ⭐ **Xem Đánh giá** | Quản lý reviews của khách hàng |
| 🔔 **Thông báo hệ thống** | Gửi và quản lý notifications |

---

## 🏗️ Tech Stack

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| **Frontend** | React + Vite | 18 / 4.4 |
| **Routing** | React Router DOM | 6.16 |
| **HTTP Client** | Axios | 1.5 |
| **UI Icons** | Lucide React | 0.292 |
| **Styling** | TailwindCSS + CSS Variables | 3.3 |
| **Backend** | Spring Boot | 3.1.5 |
| **Language** | Java | 17 |
| **Security** | Spring Security + JWT | jjwt 0.12.3 |
| **ORM** | Spring Data JPA + Hibernate | — |
| **Database** | MySQL | 8.0 |
| **API Docs** | SpringDoc OpenAPI (Swagger) | 2.0.2 |
| **Deploy** | Docker + Docker Compose | — |

---

## 📁 Cấu Trúc Dự Án

```
vexekhach/
├── 📄 docker-compose.yml          # Orchestrate 3 services
├── 📄 README.md
├── 📁 docs/                       # Tài liệu thiết kế
│   ├── class.png                  # Class diagram
│   ├── database.png               # Database diagram
│   ├── flowchart.png              # Flowchart
│   ├── sqdiagram.png              # Sequence diagram
│   └── usecase.png                # Use case diagram
├── 📁 dtb/                        # SQL scripts
│   ├── init-db.sql                # Schema & dữ liệu khởi tạo
│   ├── seed-data.sql              # Dữ liệu thực tế VN
│   ├── create-seats.sql           # Stored procedure tạo ghế
│   ├── seed-extra-data.sql        # Dữ liệu bổ sung
│   └── fix-passwords.sql          # Script sửa mật khẩu
├── 📁 miyuki-backend/             # Spring Boot Application
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/miyuki/
│       ├── config/                # SecurityConfig, CorsConfig, JacksonConfig
│       ├── controller/            # 7 REST Controllers
│       ├── dto/                   # 10 Data Transfer Objects
│       ├── entity/                # 12 JPA Entities
│       ├── exception/             # GlobalExceptionHandler + custom exceptions
│       ├── repository/            # Spring Data JPA Repositories
│       ├── security/              # JWT Filter
│       └── service/               # Business Logic
└── 📁 miyuki-frontend/            # React Application
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                # Routing chính
        ├── components/            # Navbar, StarsBg, AnimeCharacter
        ├── context/               # AuthContext (JWT management)
        ├── data/                  # cities.js (63 tỉnh thành)
        ├── pages/                 # 6 trang user + 9 trang admin
        └── services/              # api.js, apiClient.js (Axios)
```

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài và đang chạy
- Git

### Chạy Với Docker (Khuyến nghị)

```bash
# 1. Clone repository
git clone https://github.com/NguyenThienKhangWork/DoAnCongNghePhamMem.git
cd DoAnCongNghePhamMem

# 2. Khởi động toàn bộ hệ thống
docker-compose up -d

# 3. Kiểm tra trạng thái
docker-compose ps
```

> **Lần đầu chạy** sẽ mất 2–3 phút để pull images và build. Backend cần chờ MySQL healthy mới start.

### Chạy Thủ Công (Development)

#### Backend
```bash
cd miyuki-backend

# Tạo file .env từ mẫu
cp .env.example .env
# Sửa thông tin database trong .env

# Chạy với Maven
./mvnw spring-boot:run
# Hoặc trên Windows
mvnw.cmd spring-boot:run
```

#### Frontend
```bash
cd miyuki-frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

#### Database
```bash
# Khởi tạo database MySQL rồi chạy theo thứ tự:
mysql -u root -p < dtb/init-db.sql
mysql -u root -p miyuki_db < dtb/seed-data.sql
mysql -u root -p miyuki_db < dtb/create-seats.sql
```

### Dừng & Xóa

```bash
# Dừng
docker-compose down

# Dừng và xóa data
docker-compose down -v

# Rebuild sau khi thay đổi code
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
docker-compose up -d
```

---

## 🌐 Truy Cập

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | http://localhost:5173 |
| ⚙️ **Backend API** | http://localhost:8080/api/v1 |
| 📖 **Swagger UI** | http://localhost:8080/api/v1/swagger-ui.html |
| 🗄️ **MySQL** | `localhost:3306` / DB: `miyuki_db` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/register` | Đăng ký tài khoản | Public |
| `POST` | `/auth/login` | Đăng nhập, nhận JWT | Public |
| `POST` | `/auth/validate-token` | Kiểm tra token | Bearer |

### Trips & Routes
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/trips/search?departure=&destination=&date=` | Tìm kiếm chuyến | Public |
| `GET` | `/trips/{id}` | Chi tiết chuyến | Public |
| `GET` | `/trips/popular` | Tuyến phổ biến | Public |
| `GET` | `/trips/routes` | Danh sách tuyến | Public |
| `GET` | `/seats/trip/{tripId}` | Sơ đồ ghế | Public |

### Bookings
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/bookings` | Tạo đặt vé | Bearer |
| `GET` | `/bookings/my` | Vé của tôi | Bearer |
| `GET` | `/bookings/{id}` | Chi tiết vé | Bearer |
| `PUT` | `/bookings/{id}/cancel` | Hủy vé | Bearer |

### Payments
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/payments` | Tạo thanh toán | Bearer |
| `GET` | `/payments/{id}` | Chi tiết thanh toán | Bearer |
| `PUT` | `/payments/{id}/complete` | Xác nhận thanh toán | Bearer |
| `PUT` | `/payments/{id}/refund` | Yêu cầu hoàn tiền | Bearer |

### User Profile
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/users/profile` | Xem hồ sơ | Bearer |
| `PUT` | `/users/profile` | Cập nhật hồ sơ | Bearer |
| `POST` | `/users/change-password` | Đổi mật khẩu | Bearer |

### Admin (yêu cầu role ADMIN)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/admin/stats` | Thống kê tổng quan |
| `GET` | `/admin/users` | Danh sách users |
| `PUT` | `/admin/users/{id}/status` | Cập nhật trạng thái user |
| `GET` | `/admin/trips` | Danh sách chuyến |
| `POST` | `/admin/trips` | Tạo chuyến mới |
| `PUT` | `/admin/trips/{id}/status` | Cập nhật trạng thái chuyến |
| `GET` | `/admin/bookings` | Tất cả đặt vé |
| `GET` | `/admin/buses` | Danh sách xe |
| `GET` | `/admin/reviews` | Danh sách đánh giá |
| `GET` | `/admin/notifications` | Danh sách thông báo |
| `GET` | `/admin/refunds` | Yêu cầu hoàn tiền |
| `PUT` | `/admin/refunds/{id}/status` | Duyệt/từ chối hoàn tiền |

> 📖 Xem đầy đủ tại Swagger UI: http://localhost:8080/api/v1/swagger-ui.html

---

## 🗄️ Database Schema

Hệ thống gồm **13 bảng** chính:

```
users ──< user_roles >── roles
bus_companies ──< buses
routes
trips >── routes, buses
seats >── trips, bookings
bookings >── users, trips
booking_details >── bookings, seats
payments >── bookings
refunds >── bookings, payments
reviews >── bookings, users, trips
notifications >── users, bookings
discounts
```

### Mô Tả Bảng

| Bảng | Mô tả |
|------|-------|
| `users` | Tài khoản khách hàng/admin |
| `roles` | Phân quyền: CUSTOMER, DRIVER, COMPANY_ADMIN, ADMIN |
| `bus_companies` | Nhà xe (Phương Trang, Thành Bưởi, Hoàng Long...) |
| `buses` | Đầu xe (SEAT / SLEEPER / LIMOUSINE) |
| `routes` | Tuyến đường (departure ↔ destination, giá cơ bản) |
| `trips` | Chuyến đi cụ thể (route + bus + giờ + giá) |
| `seats` | Ghế theo từng chuyến (REGULAR / VIP / WINDOW) |
| `bookings` | Đơn đặt vé, trạng thái PENDING→CONFIRMED→COMPLETED |
| `booking_details` | Thông tin hành khách theo từng ghế |
| `payments` | Thanh toán cho đơn đặt vé |
| `refunds` | Yêu cầu hoàn tiền (PENDING→APPROVED→COMPLETED) |
| `reviews` | Đánh giá chuyến đi (1–5 sao) |
| `notifications` | Thông báo cho người dùng |

---

## 👤 Tài Khoản Demo

| Email | Mật khẩu | Vai trò | Ghi chú |
|-------|----------|---------|---------|
| `admin@miyuki.vn` | `Demo@123456` | ADMIN | Truy cập trang quản trị |
| `demo@miyuki.vn` | `Demo@123456` | CUSTOMER | Tài khoản demo chính |
| `lan.anh@gmail.com` | `Demo@123456` | CUSTOMER | Có sẵn 4 vé đặt |
| `minh.quan@gmail.com` | `Demo@123456` | CUSTOMER | Vé HN → Đà Nẵng CONFIRMED |
| `thu.huong@gmail.com` | `Demo@123456` | CUSTOMER | Vé HCM → Vũng Tàu CONFIRMED |

---

## 📊 Dữ Liệu Demo

| Loại | Số lượng |
|------|----------|
| 🏢 Nhà xe | 8 (Phương Trang, Thành Bưởi, Hoàng Long, Sinh Tourist...) |
| 🚌 Đầu xe | 18 (SEAT / SLEEPER / LIMOUSINE) |
| 🗺️ Tuyến đường | 30 tuyến toàn quốc |
| 🎫 Chuyến đi | ~57 chuyến (3 ngày tới) |
| 🪑 Ghế | ~2,289 ghế |
| 👥 Tài khoản | 5 user demo |

### Các Tuyến Đường

**Miền Bắc:** Hà Nội ↔ Đà Nẵng · Hải Phòng · Ninh Bình · Sa Pa · Hạ Long

**Miền Trung:** Đà Nẵng ↔ Huế · Hội An · Nha Trang · Quy Nhơn

**Miền Nam:** TP.HCM ↔ Vũng Tàu · Cần Thơ · Đà Lạt · Nha Trang · Phan Thiết · Tây Ninh

**Xuyên Việt:** Hà Nội ↔ TP.HCM (1,726 km · ~30h)

---

## 🎬 Luồng Sử Dụng Chính

### Đặt Vé (Customer)
1. Vào http://localhost:5173
2. **Tìm chuyến**: Chọn điểm đi → điểm đến → ngày → Tìm kiếm
3. **Chọn chuyến**: Xem danh sách với giá, loại xe, giờ khởi hành
4. Click **Đặt Vé** → Chuyển sang trang đăng nhập (nếu chưa đăng nhập)
5. **Đăng nhập**: `demo@miyuki.vn` / `Demo@123456`
6. **Chọn ghế**: Click ghế trên sơ đồ (xanh = trống, đỏ = đã đặt)
7. **Xác nhận đặt**: Kiểm tra tóm tắt → Đặt vé → Thanh toán
8. **Xem vé**: Menu "Vé của tôi" → Thấy vé vừa tạo

### Quản Trị (Admin)
1. Vào http://localhost:5173/admin/login
2. Đăng nhập: `admin@miyuki.vn` / `Demo@123456`
3. Xem Dashboard thống kê tổng quan
4. Quản lý Users / Trips / Bookings / Refunds qua sidebar

---

## 📐 Tài Liệu Thiết Kế

Xem tại thư mục [`docs/`](./docs/):

| File | Nội dung |
|------|----------|
| `usecase.png` | Use case diagram |
| `class.png` | Class diagram |
| `database.png` | Database ER diagram |
| `sqdiagram.png` | Sequence diagram |
| `flowchart.png` | Flowchart |

---

## 🔐 Bảo Mật

- **JWT Authentication**: Stateless, token 24h, lưu trong `localStorage`
- **BCrypt**: Mã hóa mật khẩu với salt tự động
- **CORS**: Cấu hình whitelist origins (localhost:5173, 3000, 8080)
- **Role-based Access Control**: `CUSTOMER` / `ADMIN` phân quyền endpoint
- **Spring Security**: Filter chain bảo vệ toàn bộ authenticated endpoints

---

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả tính năng"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📄 License

Dự án được phát triển cho mục đích học thuật — Đồ Án Công Nghệ Phần Mềm.

---

## 👨‍💻 Tác Giả

**Nguyễn Thiên Khang** — [GitHub](https://github.com/NguyenThienKhangWork)

---

<div align="center">

Made with 🌸 — MiYuki Express © 2026

*みゆき エクスプレス — Đặt vé xe khách, dễ dàng như mơ*

</div>
