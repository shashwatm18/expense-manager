# Docker Implementation and Deployment

## Overview

The 3-tier Local Expense Manager application was containerized using Docker and Docker Compose.

The final deployment consists of three services:

```text
Internet / Browser
        |
        | HTTP :80
        v
+---------------------+
| Frontend             |
| React + Nginx        |
| Port 80              |
+----------+----------+
           |
           | /api/*
           | Internal :3000
           v
+---------------------+
| Backend              |
| Node.js + Express    |
| Port 3000            |
+----------+----------+
           |
           | PostgreSQL
           | Internal :5432
           v
+---------------------+
| PostgreSQL           |
| PostgreSQL 16        |
| Port 5432            |
+----------+----------+
           |
           v
+---------------------+
| Named Volume         |
| expense_postgres_data|
+---------------------+
```

---

# Dockerfiles

Separate Dockerfiles are used for the frontend and backend.

```text
Dockerfile.frontend
Dockerfile.backend
```

This keeps the build configuration specific to each tier.

---

# Frontend Dockerfile

The frontend uses a multi-stage Docker build.

## Build Stage

The build stage uses:

```dockerfile
FROM node:22-alpine AS builder
```

The build process:

```text
Node.js Alpine
      |
      | npm ci
      |
      | npm run build:frontend
      v
    dist/
```

The generated Vite production files are placed in:

```text
dist/
```

## Production Stage

The production stage uses:

```dockerfile
FROM nginx:alpine
```

Only the generated frontend files are copied:

```text
dist/
   ↓
/usr/share/nginx/html
```

The Node.js build environment and build dependencies are therefore not included in the final frontend runtime image.

---

# Backend Dockerfile

The backend also uses a multi-stage Docker build.

## Build Stage

The builder uses:

```dockerfile
FROM node:22-alpine AS builder
```

Dependencies are installed using:

```bash
npm ci
```

The backend is built using:

```bash
npm run build:backend
```

The build produces:

```text
dist/server.cjs
```

## Production Stage

The production stage uses:

```dockerfile
FROM node:22-alpine
```

Only production dependencies are installed:

```bash
npm ci --omit=dev
```

The runtime image receives:

```text
dist/server.cjs
database/
```

The backend starts using:

```bash
node dist/server.cjs
```

---

# Docker Image Optimization

Several Docker optimization techniques were used.

## Multi-Stage Builds

Build dependencies are kept in the builder stages and are not copied into the final runtime stages.

This reduces the contents of the production images.

## Alpine Base Images

The Dockerfiles use Alpine-based images:

```text
node:22-alpine
nginx:alpine
```

These provide lightweight runtime environments.

## Production Dependencies

The backend production stage uses:

```bash
npm ci --omit=dev
```

Development dependencies are therefore not installed in the final backend runtime stage.

## Docker Build Context

A `.dockerignore` file is used to exclude unnecessary files:

```text
node_modules
dist
.git
.env
*.log
```

During the Dockerization process, the build context was reduced from approximately:

```text
176 MB
```

to approximately:

```text
2.45 kB
```

This reduces unnecessary data transferred to the Docker build process.

---

## Final Image Sizes

| Image | Size |
|---|---:|
| `expense-manager-frontend` | ~93.8 MB |
| `expense-manager-backend` | ~390 MB |
| `postgres:16` | ~451 MB |

# Nginx Reverse Proxy

The frontend container uses Nginx as both:

1. A static file server for the React application
2. A reverse proxy for backend API requests

The routing is:

```text
/       → React frontend
/api/*  → backend:3000
```

The backend is addressed using the Docker service name:

```text
backend:3000
```

The frontend does not use:

```text
localhost:3000
```

for container-to-container communication.

Inside a container, `localhost` refers to that same container.

---

# Docker Compose

The complete application is orchestrated using:

```text
docker-compose.yml
```

The Compose configuration manages:

- Frontend service
- Backend service
- PostgreSQL service
- Docker network
- Named database volume
- PostgreSQL health check
- Backend dependency on PostgreSQL

The application can therefore be started with:

```bash
docker compose up -d
```

---

# Docker Networking

The application uses a custom Docker bridge network:

```text
expense-network
```

The services communicate using Docker Compose service names.

```text
frontend
   |
   | backend:3000
   v
backend
   |
   | postgres:5432
   v
postgres
```

Docker's internal DNS resolves the service names.

No hard-coded container IP addresses are used.

---

# Port Exposure

Only the frontend port needs to be publicly accessible.

```text
Host :80
   ↓
Frontend :80
```

The backend uses:

```text
3000
```

internally.

PostgreSQL uses:

```text
5432
```

internally.

The database port is not published to the host.

Therefore, external users access the application through:

```text
http://<server-ip>
```

rather than directly accessing PostgreSQL.

---

# PostgreSQL

The database service uses:

```text
postgres:16
```

The application database is:

```text
expense_db
```

PostgreSQL listens internally on:

```text
5432
```

The backend connects to PostgreSQL using the Compose service name:

```text
postgres:5432
```

---

# PostgreSQL Health Check

PostgreSQL uses:

```text
pg_isready
```

for its Docker health check.

The backend depends on PostgreSQL becoming healthy before starting.

This ensures that the database is ready before the backend attempts to establish its database connection.

---

# Persistent Database Storage

PostgreSQL data is stored in a named Docker volume:

```text
expense_postgres_data
```

The volume is mounted inside PostgreSQL at:

```text
/var/lib/postgresql/data
```

The storage architecture is:

```text
PostgreSQL Container
        |
        | /var/lib/postgresql/data
        v
expense_postgres_data
```

The database data is therefore not stored only inside the PostgreSQL container's writable layer.

---

# Persistence Verification

The database record count can be checked using:

```bash
docker compose exec postgres \
  psql -U postgres -d expense_db \
  -c "SELECT COUNT(*) FROM expenses;"
```

The persistence test consists of:

```bash
docker compose down
```

followed by:

```bash
docker compose up -d
```

The database count can then be checked again:

```bash
docker compose exec postgres \
  psql -U postgres -d expense_db \
  -c "SELECT COUNT(*) FROM expenses;"
```

The records remain available because the named volume is preserved.

> `docker compose down -v` removes the named volume and therefore deletes the stored PostgreSQL data.

---

# Docker Verification

## Check Running Services

```bash
docker compose ps
```

Expected services:

```text
expense-frontend
expense-backend
expense-postgres
```

PostgreSQL should report:

```text
healthy
```

---

## Application Health

The backend exposes:

```text
/api/health
```

It can be tested through Nginx:

```bash
curl http://localhost/api/health
```

A successful response confirms that:

```text
Browser / curl
      ↓
Nginx
      ↓
Backend
```

is working.

---

## Check Database Tables

```bash
docker compose exec postgres \
  psql -U postgres -d expense_db \
  -c "\dt"
```

Expected tables include:

```text
categories
expenses
```

---

## Check Database Records

```bash
docker compose exec postgres \
  psql -U postgres -d expense_db \
  -c "SELECT COUNT(*) FROM expenses;"
```

---


# Security Considerations

The Docker deployment follows several basic security practices:

- PostgreSQL is not exposed to the public host.
- Services communicate through a private Docker network.
- Container IP addresses are not hard-coded.
- `.env` files are excluded from Git.
- Production backend dependencies exclude development dependencies.
- Frontend production runtime uses Nginx rather than the Node.js development server.
- Multi-stage builds prevent build environments from being included in the final frontend runtime image.

---

# Deployment

The application can be deployed on an AWS EC2 instance with Docker installed.

The deployment flow is:

```text
AWS EC2
   |
   | Docker Compose
   v
+----------------------------------+
| Docker                           |
|                                  |
|  Frontend :80                    |
|       ↓                           |
|  Backend :3000                   |
|       ↓                           |
|  PostgreSQL :5432                |
|       ↓                           |
|  Named Volume                    |
+----------------------------------+
```

For public access, the EC2 security group should allow HTTP traffic on:

```text
TCP 80
```

The PostgreSQL port should not be opened publicly.

The application can then be accessed through the EC2 public IP:

```text
http://<EC2-PUBLIC-IP>
```

---

