# Node + TypeScript + Express Boilerplate

Backend REST API built with Node.js, TypeScript, Express, and MongoDB.

## Features

- Modular architecture (controller, service, repository)
- JWT authentication (access + refresh tokens)
- Refresh token rotation and logout invalidation
- Role-based authorization (`user`, `admin`)
- HTTP-only auth cookies
- Request validation with Zod
- Centralized error handling
- Structured logging with Pino
- Security middleware (Helmet, CORS, rate limiting)
- MongoDB with Mongoose
- Automatic admin seeding on startup
- Pagination and filters on user listing
- Swagger docs at `/api/v1/docs`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Required env vars:

```env
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

### 3. Run in development

```bash
npm run server:dev
```

### 4. Build and run production

```bash
npm run build
npm start
```

## API Access

- Base URL: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/v1/docs`

## Scripts

| Command | Description |
|---|---|
| `npm run server:dev` | Run API server with `tsx` (hot reload) |
| `npm run build` | Compile TypeScript and rewrite path aliases |
| `npm start` | Run compiled app from `dist/` |
| `npm run test:unit` | Run unit tests |

## API Endpoints

### Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a public user account | — |
| `POST` | `/api/v1/auth/admin/register` | Register an admin account | Admin |
| `POST` | `/api/v1/auth/login` | Login and set auth cookies | — |
| `POST` | `/api/v1/auth/refresh` | Rotate tokens using refresh cookie | — |
| `POST` | `/api/v1/auth/logout` | Logout and clear tokens | User |

### Users

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/users/profile` | Get own profile | User |
| `PUT` | `/api/v1/users/profile` | Update own profile (`firstName`, `lastName`, `email`) | User |
| `GET` | `/api/v1/users` | List users with pagination and filters | Admin |
| `GET` | `/api/v1/users/:id` | Get user by ID | Self / Admin |
| `PUT` | `/api/v1/users/:id` | Update user by ID | Self / Admin |
| `DELETE` | `/api/v1/users/:id` | Delete user by ID | Self / Admin |

#### List users — query parameters

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `10`, max: `50`) |
| `firstName` | string | Filter by first name (case-insensitive) |
| `lastName` | string | Filter by last name (case-insensitive) |
| `email` | string | Filter by email (case-insensitive) |

## User model

Email is stored directly on the `User` document at registration time. When the email is updated via `PUT /users/profile` or `PUT /users/:id`, it is automatically synced to the linked `Auth` record.

## Testing

Unit tests live alongside source files as `*.spec.ts`.

```bash
npm run test:unit
```

## Project Structure

```text
src/
  api/            API routers and version entrypoints
  application/    Cross-module services (e.g. UserManagementService)
  common/         Shared middlewares, types, logger, utils
  config/         Env, DB, and runtime configuration
  docs/           OpenAPI/Swagger definitions
  modules/        Domain modules (auth, user)
  app.ts          Express app assembly
  server.ts       Server bootstrap
scripts/          Helper scripts
```

## License

ISC
