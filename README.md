# Node + TypeScript + Express Boilerplate

![Node.js](https://img.shields.io/badge/Node-20.19.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

Backend API REST built with **Node.js, Express et TypeScript**, including JWT authentication, gestion des rôles et bonnes pratiques d’architecture.

Ce projet a pour objectif de démontrer une structure backend propre et maintenable.

---

## Features

- Architecture modulaire (Controller / Service / Repository)
- Authentification JWT (access + refresh tokens)
- Rotation des refresh tokens
- Cookies HTTP-only
- Validation des requêtes (Zod)
- Gestion centralisée des erreurs
- Logger (Winston)
- Sécurité : Helmet, CORS, Rate limiting
- MongoDB avec Mongoose
- Seed automatique des comptes admin au démarrage
- Documentation Swagger (`/api/v1/docs`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/masmoud/masmoud-rest-api.git
cd node-ts-express-boilerplate
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
├─ common/        # middlewares, utils, validators
├─ config/        # environment & database config
├─ modules/
│  ├─ auth/
│  └─ user/
├─ routes/
├─ app.ts
└─ server.ts
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

- Tests unitaires
- RBAC avec permissions dynamiques
- Dockerisation
- CI/CD pipeline

---

## License

MIT
