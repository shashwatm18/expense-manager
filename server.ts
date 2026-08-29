import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import expensesRouter from './server/routes/expenses.js';
import databaseRouter from './server/routes/database.js';
import { initializeDatabaseSchema } from './server/db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API Logging Middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
      });
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: '3-Tier Expense Manager API',
      timestamp: new Date().toISOString(),
    });
  });

  // Application Tier API Routes
  app.use('/api/expenses', expensesRouter);
  app.use('/api/db', databaseRouter);

  // Auto-attempt database schema check on startup
  initializeDatabaseSchema().catch((err) => {
    console.warn('Initial schema boot notification:', err?.message || err);
  });

  // Presentation Tier / Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log('🚀 3-Tier Expense Manager Server Running');
    console.log(`📡 Local Presentation & API URL: http://localhost:${PORT}`);
    console.log('🐘 Data Tier: PostgreSQL database connection configured');
    console.log('====================================================');
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Start Error:', err);
  process.exit(1);
});
