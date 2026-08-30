# Git Practices and Repository Management

## Overview

The application was initially developed and pushed to GitHub before the Dockerization work.

The DevOps implementation was then added incrementally using meaningful Git commits rather than combining all changes into one large commit.

This makes the repository history clearly show the progression of the work.

---

## Git Repository

The project is maintained in a Git repository and the changes are pushed to the GitHub repository.

The working branch is:

```text
main
```

The repository history can be viewed using:

```bash
git log --oneline --decorate
```

---

## Meaningful Commit History

The Dockerization work was intentionally divided into separate logical commits.

The commit history contains steps such as:

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
```

Each commit represents a specific development or DevOps change.

This avoids using a single large commit containing the complete Docker implementation.

---

## Dockerization Commit Structure

### Frontend Dockerfile

A separate commit introduced:

```text
Dockerfile.frontend
```

The frontend Dockerfile uses a multi-stage build with:

```text
Node.js Alpine
        ↓
Vite production build
        ↓
Nginx Alpine
```

---

### Backend Dockerfile

A separate commit introduced:

```text
Dockerfile.backend
```

The backend Dockerfile uses a multi-stage build with:

```text
Node.js Alpine
        ↓
esbuild production bundle
        ↓
Node.js Alpine runtime
```

---

### Nginx Configuration

A separate commit introduced:

```text
nginx.conf
```

The configuration allows Nginx to:

- Serve the React frontend
- Forward `/api/*` requests to the backend
- Use the Docker Compose service name `backend`

---

### Docker Build Context

A separate commit introduced:

```text
.dockerignore
```

The file excludes unnecessary files from the Docker build context.

Examples:

```text
node_modules
dist
.git
.env
*.log
```

This prevents unnecessary files and sensitive configuration from being sent during Docker builds.

---

### npm Lockfile

The project uses:

```text
package-lock.json
```

The lockfile allows dependencies to be installed reproducibly using:

```bash
npm ci
```

This is used by the Docker build stages.

---

### Docker Compose

A separate commit introduced:

```text
docker-compose.yml
```

Docker Compose is responsible for orchestrating:

- Frontend
- Backend
- PostgreSQL
- Docker network
- PostgreSQL named volume
- PostgreSQL health check
- Service dependency

---

## `.gitignore`

The repository contains a `.gitignore` file to prevent generated files, dependencies, logs, and sensitive configuration from being committed.

Current exclusions include:

```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
```

The environment example file remains available:

```text
.env.example
```

This allows required environment variables to be documented without committing actual environment configuration.

---

## Sensitive Files

Actual `.env` files are not committed to Git.

This prevents database credentials and other environment-specific configuration from being exposed through the repository.

---

## Useful Git Commands

### Check repository status

```bash
git status
```

### View commit history

```bash
git log --oneline --decorate
```

### View recent commits

```bash
git log --oneline --decorate -10
```

### View unstaged changes

```bash
git diff
```

### View staged changes

```bash
git diff --cached
```

### Stage a file

```bash
git add <file>
```

### Create a commit

```bash
git commit -m "Commit message"
```

### Push changes

```bash
git push origin main
```

---

## Final Repository Verification

Before submission, verify the repository:

```bash
git status
```

Expected result:

```text
nothing to commit, working tree clean
```

Verify the commit history:

```bash
git log --oneline --decorate -10
```

The history should clearly show separate commits for the major Dockerization steps.

---

## Git Hygiene Checklist

- [x] Git repository maintained throughout development
- [x] Meaningful incremental commits
- [x] Separate commits for Dockerization components
- [x] `.gitignore` configured
- [x] Sensitive `.env` files excluded
- [x] `package-lock.json` included for reproducible builds
- [x] Final working tree verified before submission