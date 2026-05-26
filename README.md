# VietRide X - DoAnCongNghePhamMem

Full-stack bus ticket booking project based on `vietride-x.html`.

## Tech stack

- Backend: Spring Boot 3, Spring Web, Spring Data JPA, MySQL
- Frontend: React 19, Vite, lucide-react
- Database: MySQL database `vietride_x`

## Project structure

```text
backend/   Spring Boot REST API
frontend/  React/Vite web app
```

## MySQL config

Default backend config is in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vietride_x?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Change `username` and `password` to match your MySQL account. Spring Boot creates/updates tables automatically and seeds sample routes/trips on first run.

## Run backend

```bash
cd backend
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

Main endpoints:

- `GET /api/cities`
- `GET /api/routes/popular`
- `GET /api/trips/search?origin=Ho Chi Minh&destination=Da Nang&date=2026-05-10`
- `POST /api/bookings`
- `GET /api/dashboard`

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

If backend runs on a different URL, create `frontend/.env`:

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```
