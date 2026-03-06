# Node + TypeScript + Express Boilerplate

![Node.js](https://img.shields.io/badge/Node-20.19.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

Backend API REST built with **Node.js, Express et TypeScript**, featuring JWT authentification, role management, and best practices for maintainable architecture.

This project aims to demonstrate a clean and maintainable backend structure.

---

## Features

- Modular architecture (Controller / Service / Repository)
- JWT authentication (access + refresh tokens)
- Refresh token rotation
- HTTP-only cookies
- Request validation (Zod)
- Centralized error handling
- Logging (Winston)
- Security : Helmet, CORS, Rate limiting
- MongoDB with Mongoose
- Automatic seeding of admin accounts on startup
- Swagger Documentation (`/api/v1/docs`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/masmoud/masmoud-rest-api.git
cd masmoud-rest-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Required variables :

```
NODE_ENV=
BASE_URL=
PORT=
MONGO_URI=
JWT_ACCESS=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH=
JWT_REFRESH_EXPIRES_IN=
ALLOWED_ORIGINS=
ADMIN_USERS=
LOG_LEVEL=
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Access the API

Base URL:

```
http://localhost:3000/api/v1
```

Swagger documentation:

```
http://localhost:3000/api/v1/docs
```

---

## Scripts

- `npm run dev` – start development server
- `npm run build` – compile TypeScript
- `npm start` – start production server
- `npm run lint` – run ESLint
- `npm run test` – run tests

---

## Project Structure

```
src/
├─ api/                     # Top-level API router
│   ├─ index.ts             # API entry point
│   └─ v1/
│       ├─ routes.ts        # v1 aggregator
│       ├─ system/          # health & readiness endpoints
│       └─ swagger/         # swagger docs routes
├─ modules/                 # Feature modules
│   └─ v1/
│       ├─ auth/            # Auth module
│       └─ user/            # User module
├─ common/                  # Middlewares, utils, validators, types
├─ config/                  # Environment & database configuration
├─ docs/                    # Swagger/OpenAPI definitions
├─ app.ts                   # App initialization
└─ server.ts                # Server entry point
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Auth

- `POST /api/v1/auth/register` – Register a new user
- `POST /api/v1/auth/admin/register` – Register a new admin (ADMIN only)
- `POST /api/v1/auth/login` – Login
- `POST /api/v1/auth/refresh` – Refresh access token
- `POST /api/v1/auth/logout` – Logout

### User

- `GET /api/v1/users/profile` – Get current user profile
- `GET /api/v1/users/:id` – Get user by ID
- `GET /api/v1/users` – List all users
- `PUT /api/v1/users/:id` – Update user
- `DELETE /api/v1/users/:id` – Delete user

---

## Possible Improvements

- Unit tests
- RBAC with dynamic permissions (Role-Based Access Control)
- Dockerization
- CI/CD pipeline

---

## License

MIT
