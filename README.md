# 3-Tier Local Expense Manager

## App Description

A 3-tier expense management application built using **React, Node.js/Express, and PostgreSQL**.

The application provides expense tracking, filtering, sorting, budget tracking, category analysis, and data export functionality.

The application was containerized using Docker and deployed using Docker Compose on AWS EC2.

## Architecture Notes

The application follows a 3-tier architecture:

```text
Internet
   |
   | HTTP :80
   v
Nginx / React Frontend
   |
   | :3000
   v
Node.js / Express Backend
   |
   | :5432
   v
PostgreSQL Database
   |
   v
Named Docker Volume
```

### Presentation Tier

- React
- TypeScript
- Vite
- Tailwind CSS
- Nginx for production serving and reverse proxy

### Application Tier

- Node.js
- Express.js
- TypeScript
- esbuild

### Data Tier

- PostgreSQL 16
- Named Docker volume for persistent database storage

## Optimization Choices

- Used **multi-stage Docker builds** for frontend and backend.
- Used **Alpine-based images** for lightweight production images.
- Frontend uses **Nginx** as the production runtime.
- Only the frontend production `dist` files are copied into the final frontend image.
- Backend production stage installs only production dependencies using `npm ci --omit=dev`.
- Added `.dockerignore` to exclude unnecessary files from the Docker build context.
- Backend and PostgreSQL ports remain internal to the Docker network.

## Final Image Sizes

| Image | Size |
|---|---:|
| `expense-manager-frontend` | ~93.8 MB |
| `expense-manager-backend` | ~390 MB |
| `postgres:16` | ~451 MB |