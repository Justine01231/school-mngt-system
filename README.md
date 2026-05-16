# School Management System

A full-stack School Management System built with:

- **API**: Node.js · Express · Prisma ORM · PostgreSQL · TypeScript
- **Web**: React · TypeScript · Vite · TailwindCSS · Zustand · React Query
- **Infrastructure**: Docker · docker-compose

---

## Project Structure

```
school-mngt-system/
├── api/                  # Express REST API
│   ├── prisma/           # Database schema & migrations
│   ├── src/              # TypeScript source
│   ├── .env.example      # Environment variable template
│   └── Dockerfile
├── web/                  # React frontend
│   ├── src/
│   ├── .env.example      # Environment variable template
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.override.yml.example
└── package.json          # Root monorepo scripts
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Docker & Docker Compose (optional, for containerised setup)
- PostgreSQL (if running locally without Docker)

### 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/school-mngt-system.git
cd school-mngt-system
npm run install:all
```

### 2 — Configure Environment Variables

```bash
# API
cp api/.env.example api/.env
# Edit api/.env and set DATABASE_URL, JWT secrets, etc.

# Web
cp web/.env.example web/.env
# Edit web/.env if your API runs on a different host/port
```

### 3a — Run Locally (without Docker)

```bash
# Start PostgreSQL (or update DATABASE_URL in api/.env to point to your instance)

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start both API and Web in parallel
npm run dev
```

| Service | URL                          |
|---------|------------------------------|
| API     | http://localhost:3000        |
| Web     | http://localhost:5173        |

### 3b — Run with Docker Compose

```bash
# Set up local override with your secrets
cp docker-compose.override.yml.example docker-compose.override.yml
# Edit docker-compose.override.yml with your secrets

docker compose up --build
```

---

## Available Scripts (Root)

| Script             | Description                                      |
|--------------------|--------------------------------------------------|
| `npm run dev`      | Start API + Web in parallel (development)        |
| `npm run dev:api`  | Start only the API                               |
| `npm run dev:web`  | Start only the Web                               |
| `npm run install:all` | Install dependencies for root, api, and web   |
| `npm run db:migrate`  | Run Prisma migrations (dev)                   |
| `npm run db:seed`     | Seed the database with initial data           |

---

## Environment Variables

### API (`api/.env`)

| Variable            | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `NODE_ENV`          | Yes      | `development` / `production`                     |
| `PORT`              | Yes      | Port the API listens on (default: `3000`)        |
| `DATABASE_URL`      | Yes      | PostgreSQL connection string                     |
| `JWT_ACCESS_SECRET` | Yes      | Secret for signing access tokens (≥32 chars)     |
| `JWT_REFRESH_SECRET`| Yes      | Secret for signing refresh tokens (≥32 chars)    |
| `JWT_ACCESS_TTL`    | Yes      | Access token lifetime (e.g. `15m`)               |
| `JWT_REFRESH_TTL`   | Yes      | Refresh token lifetime (e.g. `7d`)               |
| `BCRYPT_ROUNDS`     | Yes      | bcrypt cost factor (default: `12`)               |
| `CORS_ORIGINS`      | Yes      | Comma-separated allowed CORS origins             |
| `LOG_LEVEL`         | No       | Pino log level (default: `info`)                 |

### Web (`web/.env`)

| Variable              | Required | Description                                    |
|-----------------------|----------|------------------------------------------------|
| `VITE_API_BASE_URL`   | Yes      | Base URL of the API (e.g. `http://localhost:3000/api/v1`) |

---

## Security Notes

- **Never commit `.env` files.** Use `.env.example` files as templates.
- Generate strong JWT secrets with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- The `docker-compose.yml` in this repo uses **placeholder** secrets. Override them locally with `docker-compose.override.yml`.

---

## License

MIT
