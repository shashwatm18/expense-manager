# Git Changes

## Changes Made

### 1. Added System Architecture Diagram

Added a system architecture diagram to represent the application's 3-tier architecture.

**Why:**  
To clearly document the frontend, backend, PostgreSQL database, Docker network, and persistent storage architecture.

### 2. Separated Frontend and Backend Build Scripts

Added separate build scripts for the frontend and backend.

**Why:**  
To allow the frontend and backend to be built independently during Docker image creation.

### 3. Added Frontend Dockerfile

Added a multi-stage Dockerfile for the React frontend.

**Why:**  
To build the frontend separately and serve the production build using Nginx.

### 4. Added Backend Dockerfile

Added a multi-stage Dockerfile for the Node.js/Express backend.

**Why:**  
To create a production-ready backend image while separating the build environment from the runtime environment.

### 5. Added Nginx Configuration

Added an Nginx configuration for the frontend.

**Why:**  
To serve the production frontend and reverse proxy API requests to the backend.

### 6. Added `.dockerignore`

Added a `.dockerignore` file.

**Why:**  
To exclude unnecessary files from the Docker build context.

### 7. Added `package-lock.json`

Added the npm lockfile.

**Why:**  
To ensure reproducible dependency installation during Docker builds.

### 8. Added Docker Compose

Added `docker-compose.yml` to define the frontend, backend, and PostgreSQL services.

**Why:**  
To orchestrate the complete 3-tier application using Docker Compose.
