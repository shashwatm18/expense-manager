# 3-Tier Local Expense Manager (React + Node.js + PostgreSQL)

A complete, production-ready **3-Tier CRUD application** for tracking personal and organizational expenses. Built entirely for **local execution** without requiring any external cloud services, third-party hosting, or Docker containers.

---

## 🏛️ 3-Tier Architecture Overview

```
+-------------------------------------------------------------+
|                     1. PRESENTATION TIER                    |
|  - React 19 + TypeScript + Tailwind CSS                     |
|  - Single Page Interface (SPA) with responsive data tables  |
|  - Real-time search, multi-field filtering & sort controls  |
|  - Category analytics, budget tracking, and CSV/JSON export |
+------------------------------▲------------------------------+
                               │ HTTP / REST APIs (/api/*)
                               ▼
+-------------------------------------------------------------+
|                     2. APPLICATION TIER                     |
|  - Node.js + Express.js Web Server                          |
|  - RESTful API routing (/api/expenses, /api/db, /api/stats) |
|  - Request validation, error handling, parameter parsing    |
|  - PostgreSQL Connection Pool Manager (pg.Pool)             |
+------------------------------▲------------------------------+
                               │ TCP / SQL Protocol (Port 5432)
                               ▼
+-------------------------------------------------------------+
|                        3. DATA TIER                         |
|  - PostgreSQL Relational Database (Local Instance)          |
|  - Relational Schema: `categories`, `expenses`              |
|  - High-performance B-Tree indexes, foreign keys, triggers  |
|  - DDL Schema: `database/schema.sql`                        |
+-------------------------------------------------------------+
```

---

## 📋 Prerequisites

Before starting, ensure the following software is installed on your local machine:

1. **Node.js**: Version `18.x` or higher ([Download Node.js](https://nodejs.org/))
2. **npm**: Version `9.x` or higher (bundled with Node.js)
3. **PostgreSQL**: Version `14.x`, `15.x`, or `16.x` ([Download PostgreSQL](https://www.postgresql.org/download/))

---

## 🚀 Step-by-Step Local Setup Guide (Without Docker)

Follow these direct steps to configure and run the full stack locally on your computer.

### Step 1: Install PostgreSQL Locally

Choose your operating system:

#### **macOS (via Homebrew)**
```bash
# Install PostgreSQL
brew install postgresql@16

# Start the PostgreSQL background service
brew services start postgresql@16
```

#### **Ubuntu / Debian Linux**
```bash
# Update package repositories and install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start and enable the PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **Windows (via Winget or Official Installer)**
```powershell
# Using Windows Package Manager (Winget)
winget install PostgreSQL.PostgreSQL

# Or download the graphical installer from:
# https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
```

---

### Step 2: Create the Local PostgreSQL Database & User

Open your terminal and create the database named `expense_db`:

#### **macOS / Linux:**
```bash
# Option A: Using createdb command
createdb expense_db

# Option B: Using psql command line interface
psql -U postgres -c "CREATE DATABASE expense_db;"
```

> **Tip:** If your local PostgreSQL user has a password (e.g. `postgres`), you can set or verify it with:
> ```bash
> psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
> ```

#### **Windows (Command Prompt / PowerShell):**
```cmd
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE expense_db;"
```

---

### Step 3: Configure Local Environment Variables

1. In the root directory of this project, create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

2. Open `.env` and verify your local PostgreSQL credentials:

```env
# Application Port
PORT=3000

# Option 1: Full Connection URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_db"

# Option 2: Parameter-based connection
PGHOST="localhost"
PGPORT=5432
PGUSER="postgres"
PGPASSWORD="postgres"
PGDATABASE="expense_db"
```

---

### Step 4: Install Dependencies

Run `npm install` in the project root directory to install all client and server dependencies:

```bash
npm install
```

---

### Step 5: Initialize the PostgreSQL Database Schema

Run the automated database initializer script. This reads `database/schema.sql`, creates all tables, triggers, and indexes in your local PostgreSQL database, and seeds initial data:

```bash
npm run db:init
```

**Expected output:**
```
----------------------------------------------------
🐘 3-Tier Expense Manager - Database Initializer
----------------------------------------------------
Connecting to PostgreSQL at localhost:5432/expense_db (User: postgres)...
✓ Successfully connected to PostgreSQL instance.
Reading SQL Schema from: .../database/schema.sql
Executing DDL statements (Creating tables, indexes, triggers)...
✓ Schema and indexes initialized successfully.
✓ Seed data inserted successfully.
✓ Total expenses now in database: 15
----------------------------------------------------
🎉 Database initialization complete. Ready to run "npm run dev".
----------------------------------------------------
```

---

### Step 6: Start the Local Application

Start the integrated development server (which boots the Express API and mounts the React frontend):

```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Database Schema & DDL Details

The data tier is defined in `database/schema.sql`.

### Tables

#### 1. `categories` Table
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Unique Category Identifier |
| `name` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Name (e.g. Food & Dining, Travel) |
| `color` | `VARCHAR(20)` | `DEFAULT '#64748b'` | Hex color for UI charts |
| `icon` | `VARCHAR(30)` | `DEFAULT 'Tag'` | Icon key identifier |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

#### 2. `expenses` Table
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Unique Expense Identifier |
| `title` | `VARCHAR(120)` | `NOT NULL` | Expense name or payee |
| `amount` | `NUMERIC(12, 2)` | `NOT NULL, CHECK (amount > 0)` | Monetary expense value |
| `category_id` | `INTEGER` | `REFERENCES categories(id)` | Foreign key to category |
| `category_name`| `VARCHAR(50)` | `NOT NULL` | Denormalized category name |
| `date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Transaction date |
| `payment_method` | `VARCHAR(50)`| `NOT NULL DEFAULT 'Credit Card'` | Credit Card, Cash, etc. |
| `status` | `VARCHAR(20)` | `CHECK (status IN ('Paid','Pending','Reimbursed'))` | Payment status |
| `notes` | `TEXT` | `NULL` | Optional memo / details |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Record creation time |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | Auto-updated via trigger |

### Indexes & Performance
- `idx_expenses_date`: Fast date-range filtering and temporal sorting.
- `idx_expenses_category`: Rapid aggregation by spending category.
- `idx_expenses_payment_method`: Filter by payment mode.
- `idx_expenses_amount`: Range querying and sorting by value.

---

## 📡 REST API Reference

The Application Tier exposes the following endpoints under `/api`:

### 1. Expense Operations
| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/expenses` | List & filter expenses | `search`, `category`, `payment_method`, `status`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `sortBy`, `order`, `page`, `limit` |
| `GET` | `/api/expenses/:id` | Get single expense | Path: `id` (integer) |
| `POST` | `/api/expenses` | Create new expense | Body: `{ title, amount, category_name, date, payment_method, status, notes }` |
| `PUT` | `/api/expenses/:id` | Update expense | Body: Partial expense fields |
| `DELETE` | `/api/expenses/:id` | Delete expense | Path: `id` (integer) |

### 2. Category & Analytics Operations
| Method | Endpoint | Description | Sample Response |
|---|---|---|---|
| `GET` | `/api/expenses/stats` | Aggregated metrics | `{ totalSpent, expenseCount, averageExpense, byCategory, byPaymentMethod, byMonth }` |
| `GET` | `/api/expenses/categories` | List all categories | `[{ id: 1, name: "Food & Dining", color: "#f97316" }, ...]` |

### 3. Database Diagnostics & Maintenance
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/db/status` | Inspect live PostgreSQL connection status, latency, row counts |
| `GET` | `/api/db/ping` | Ping connection test |
| `POST` | `/api/db/init` | Execute DDL schema creation directly |
| `POST` | `/api/db/seed` | Seed default sample expense records |
| `GET` | `/api/db/schema` | Read raw `schema.sql` file |

---

## 🛠️ Troubleshooting Local Setup

### 1. `ECONNREFUSED 127.0.0.1:5432`
- **Cause**: The PostgreSQL service is not currently running.
- **Fix**:
  - macOS: `brew services restart postgresql@16`
  - Linux: `sudo systemctl restart postgresql`
  - Windows: Open Services (`services.msc`) and start `postgresql-x64-16`.

### 2. `password authentication failed for user "postgres"`
- **Cause**: The password in `.env` doesn't match your local PostgreSQL `postgres` user password.
- **Fix**: Reset the password with:
  ```bash
  psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
  ```
  Then set `PGPASSWORD="postgres"` in your `.env`.

### 3. `database "expense_db" does not exist`
- **Fix**: Run:
  ```bash
  psql -U postgres -c "CREATE DATABASE expense_db;"
  ```
  Then run `npm run db:init`.

---

## 📦 Production Build & Start

To build and run in production mode:

```bash
# 1. Compile the React client and bundle the Express server into dist/
npm run build

# 2. Run the bundled standalone server
npm run start
```

---

## 📄 License
MIT License. Built for local offline-first 3-tier application workflows.
