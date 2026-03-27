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

- `npm run server:dev`: run API server with `tsx`
- `npm run build`: compile TypeScript and rewrite path aliases
- `npm start`: run compiled app
- `npm run test:unit`: run unit tests only
- `npm run test:integration`: run no-DB integration test (`system.health.integration.spec.ts`)
- `npm run test:all`: run unit + no-DB integration, then DB integration only if `TEST_MONGO_URI` is set

## Testing Notes

- `test:integration` is intentionally DB-free.
- `test:all` runs `test:unit` then `test:integration`, and attempts DB-backed integration only if `TEST_MONGO_URI` is provided.

## API Endpoints

### Auth

- `POST /api/v1/auth/register`: register public user account
- `POST /api/v1/auth/admin/register`: register admin account (admin token required)
- `POST /api/v1/auth/login`: login and set auth cookies
- `POST /api/v1/auth/refresh`: rotate token using refresh cookie
- `POST /api/v1/auth/logout`: logout (authenticated)

### Users

- `GET /api/v1/users/profile`: get authenticated user profile
- `PUT /api/v1/users/profile`: update authenticated user profile
- `GET /api/v1/users`: list users (admin only)
- `GET /api/v1/users/:id`: get user by ID (self or admin)
- `PUT /api/v1/users/:id`: update user by ID (self or admin)
- `DELETE /api/v1/users/:id`: delete user by ID (self or admin)

## Project Structure

```text
src/
	api/            API routers and version entrypoints
	common/         shared middlewares, types, logger, utils
	config/         env, DB, and runtime configuration
	docs/           OpenAPI/Swagger definitions
	modules/        domain modules (auth, user, role)
	app.ts          Express app assembly
	server.ts       server bootstrap
tests/            integration setup and specs
scripts/          helper scripts (tree, test-all)
```

## License

ISC
