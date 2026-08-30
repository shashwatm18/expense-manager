# 3-Tier Local Expense Manager

A complete **3-tier CRUD application** for tracking personal and organizational expenses.

The application is built using **React, Node.js/Express, and PostgreSQL** and provides expense management, category analytics, budget tracking, filtering, sorting, and data export functionality.

---

## 🏛️ 3-Tier Architecture

The application follows a 3-tier architecture:

```text
+-------------------------------------------------------------+
|                     1. PRESENTATION TIER                    |
|                                                             |
|  React + TypeScript + Tailwind CSS                          |
|  Responsive user interface                                  |
|  Expense tables, search, filtering and sorting              |
|  Category analytics and budget tracking                     |
|  CSV / JSON export                                           |
+------------------------------▲------------------------------+
                               |
                               | HTTP / REST APIs
                               | /api/*
                               ▼
+-------------------------------------------------------------+
|                     2. APPLICATION TIER                     |
|                                                             |
|  Node.js + Express.js                                       |
|  RESTful API                                                 |
|  Request validation and error handling                      |
|  PostgreSQL connection pool                                  |
+------------------------------▲------------------------------+
                               |
                               | TCP / SQL
                               | Port 5432
                               ▼
+-------------------------------------------------------------+
|                         3. DATA TIER                        |
|                                                             |
|  PostgreSQL                                                  |
|  Relational database                                         |
|  Categories and expenses                                     |
|  Database schema and seed data                               |
+-------------------------------------------------------------+
```

---

## 🚀 Features

- Expense management
- Category management
- Expense creation, editing and deletion
- Expense search
- Multi-field filtering
- Sorting
- Category-wise analytics
- Budget tracking
- Payment method analysis
- CSV export
- JSON export
- REST API
- PostgreSQL database
- Responsive React interface

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- esbuild

### Database

- PostgreSQL
- SQL
- `pg` PostgreSQL client

---

## 📁 Project Structure

```text
local-expense-manager/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── server/
│   ├── db.ts
│   └── init-db.ts
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── server.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
```

---

# 📋 Prerequisites

Before running the application locally, install:

- Node.js
- npm
- PostgreSQL

Verify Node.js and npm:

```bash
node --version
npm --version
```

Verify PostgreSQL:

```bash
psql --version
```

---

# ⚙️ Environment Configuration

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_db
PORT=3000
```

The actual `.env` file should not be committed to Git.

An example environment configuration can be maintained separately as:

```text
.env.example
```

---

# 📦 Installation

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Enter the project directory:

```bash
cd local-expense-manager
```

Install dependencies:

```bash
npm install
```

---

# 🗄️ Database Setup

The database schema is available in:

```text
database/schema.sql
```

Seed data is available in:

```text
database/seed.sql
```

The application also provides database initialization functionality through the backend.

---

# ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application backend runs on:

```text
http://localhost:3000
```

The frontend is served through the Vite development environment.

---

# 🔨 Build Commands

The project provides separate build commands for the frontend and backend.

## Build Frontend

```bash
npm run build:frontend
```

The production frontend files are generated in:

```text
dist/
```

## Build Backend

```bash
npm run build:backend
```

The backend production bundle is generated as:

```text
dist/server.cjs
```

## Start Production Backend

```bash
npm start
```

---

# 🧪 Lint / Type Checking

Run TypeScript type checking using:

```bash
npm run lint
```

---

# 🔌 API

The backend provides REST APIs for the application.

Main API areas include:

```text
/api/expenses
/api/db
/api/stats
/api/health
```

### Health Check

The backend provides:

```text
GET /api/health
```

Example:

```bash
curl http://localhost:3000/api/health
```

A successful response confirms that the backend service is running.

---

# 🐘 PostgreSQL Database

The application uses PostgreSQL as its data tier.

The main database entities include:

```text
categories
expenses
```

The database schema is defined in:

```text
database/schema.sql
```

Sample data is provided through:

```text
database/seed.sql
```

The backend uses a PostgreSQL connection pool for database communication.

---

# 🏗️ Production Containerization

The application can also be deployed using Docker.

The Docker implementation uses separate Dockerfiles for the frontend and backend:

```text
Dockerfile.frontend
Dockerfile.backend
```

The Dockerized deployment consists of:

```text
React + Nginx
       ↓
Node.js + Express
       ↓
PostgreSQL
```

Both frontend and backend use multi-stage Docker builds.

The frontend uses Nginx as the production runtime, while the backend uses Node.js for the production runtime.

---

# 🐳 Docker Compose

The complete application can be orchestrated using:

```text
docker-compose.yml
```

Start the complete stack:

```bash
docker compose up -d
```

Check running services:

```bash
docker compose ps
```

Stop the services:

```bash
docker compose down
```

The Docker deployment uses:

- Frontend container
- Backend container
- PostgreSQL container
- Custom Docker network
- PostgreSQL named volume
- PostgreSQL health check

---

# 🌐 Docker Network Architecture

The Dockerized application uses service names for internal communication.

```text
Frontend / Nginx
       |
       | backend:3000
       v
Backend / Express
       |
       | postgres:5432
       v
PostgreSQL
```

The frontend does not use `localhost` to communicate with the backend inside Docker.

The backend communicates with PostgreSQL using the PostgreSQL Compose service name.

---

# 💾 Database Persistence

PostgreSQL data is stored using a Docker named volume.

This allows database data to survive container recreation.

The persistence can be verified using:

```bash
docker compose down
docker compose up -d
```

and then checking the database records again.

---

# 📚 Documentation

Additional DevOps documentation is available in the `docs/` directory.

### Git Documentation

```text
docs/GIT_README.md
```

Contains information about:

- Git workflow
- Meaningful commits
- Repository hygiene
- `.gitignore`
- Sensitive files
- Git verification

### Docker Documentation

```text
docs/DOCKER_README.md
```

Contains information about:

- Dockerfiles
- Multi-stage builds
- Image optimization
- Nginx reverse proxy
- Docker Compose
- Docker networking
- PostgreSQL persistence
- Health checks
- EC2 deployment
- Security considerations

---

# ☁️ AWS EC2 Deployment

The containerized application can be deployed on an AWS EC2 instance with Docker installed.

The production deployment follows:

```text
Internet
   |
   | HTTP :80
   v
AWS EC2
   |
   | Docker Network
   |
   +--> Frontend / Nginx
   |
   +--> Backend / Node.js
   |
   +--> PostgreSQL
            |
            +--> Named Volume
```

Only the required public application port is exposed to external users, while backend and database communication remains internal to Docker.

---

# 🔐 Security

The project follows basic security practices:

- Environment files containing credentials are excluded from Git.
- `.gitignore` prevents sensitive configuration from being committed.
- PostgreSQL does not need to be publicly exposed.
- Backend and database services communicate through the internal Docker network.
- Production backend installation uses only production dependencies.
- Docker containers communicate using service names instead of hard-coded IP addresses.

---

# 🔀 Git Repository

The project is maintained using Git with incremental and meaningful commits.

The development history includes separate commits for major changes such as:

```text
Initial Commit
Add system architecture diagram
Separate frontend and backend build scripts
Add frontend multi-stage Dockerfile
Add backend multi-stage Dockerfile
Add Nginx reverse proxy configuration
Add Docker build context exclusions
Add npm lockfile for reproducible builds
Add Docker Compose orchestration
Add Git and Docker documentation
```

This provides a clear history of the application's development and Dockerization process.

---

# 📌 Useful Commands

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Frontend build

```bash
npm run build:frontend
```

### Backend build

```bash
npm run build:backend
```

### Production backend

```bash
npm start
```

### Type checking

```bash
npm run lint
```

### Docker Compose

```bash
docker compose up -d
```

```bash
docker compose ps
```

```bash
docker compose down
```

### Docker logs

```bash
docker compose logs backend
```

```bash
docker compose logs frontend
```

```bash
docker compose logs postgres
```

---

# 👨‍💻 Development

This project was developed as a 3-tier application and subsequently containerized and deployed as part of the DevOps implementation.

The project demonstrates the integration of:

- Frontend development
- Backend API development
- Relational database management
- Containerization
- Container orchestration
- Docker networking
- Persistent storage
- Cloud deployment
- Git-based version control

---

# 📄 License

This project is intended for educational and development purposes.