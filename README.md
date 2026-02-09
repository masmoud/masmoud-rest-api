# Node.js TypeScript Express Boilerplate

![Node.js](https://img.shields.io/badge/Node-20.19.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

Production-ready boilerplate for building scalable APIs with Node.js, Express, TypeScript, and MongoDB. Perfect for portfolio or starting new projects quickly.

---

## Features

- ✅ Node.js + TypeScript
- ✅ Express framework
- ✅ MongoDB with Mongoose
- ✅ Environment validation with Zod
- ✅ Security middleware: Helmet, CORS, Rate Limiter
- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Clean architecture: Controllers / Services / Repositories
- ✅ Docker-ready setup
- ✅ Testing setup (Jest + Supertest) [coming soon]

---

## Project Structure

```

src/
├─ app.ts
├─ server.ts
├─ config/
├─ controllers/
├─ services/
├─ repositories/
├─ models/
├─ routes/
├─ middlewares/
├─ utils/
└─ tests/

```

---

## Getting Started

1. **Clone the repo**

```bash
git clone git@github.com:masmoud/node-ts-express-boilerplate.git
cd node-ts-express-boilerplate
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file based on `.env.example`**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mydb
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ALLOWED_ORIGINS=http://localhost:3000
```

4. **Run in development mode**

```bash
npm run dev
```

API will run on [http://localhost:5000](http://localhost:5000)

---

## Example API Endpoints

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| POST   | /api/auth/login   | User login with JWT       |
| POST   | /api/auth/refresh | Refresh access token      |
| POST   | /api/auth/logout  | Logout and revoke refresh |
| GET    | /api/users        | Get all users (admin)     |
| POST   | /api/users        | Create a new user         |

> ⚠️ Add more endpoints as your app grows.

---

## Scripts

- `npm run dev` → Start dev server with hot reload
- `npm run build` → Compile TypeScript to JavaScript
- `npm run start` → Start production server
- `npm run test` → Run tests (Jest + Supertest)

---

## Docker

- MongoDB ready to use via Docker
- App can be containerized with `Dockerfile` and `docker-compose.yml`
- Example command to run everything:

```bash
docker-compose up --build
```

---

## License

MIT
