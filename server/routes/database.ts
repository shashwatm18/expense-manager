import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getDbStatus, testConnection, initializeDatabaseSchema, seedSampleData } from '../db.js';

const router = Router();

// GET /api/db/status - Get connection diagnostic status
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await getDbStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to inspect database status', details: error.message });
  }
});

// GET /api/db/ping - Quick latency check
router.get('/ping', async (_req: Request, res: Response) => {
  try {
    const result = await testConnection();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Database ping failed', details: error.message });
  }
});

// POST /api/db/init - Initialize schema
router.post('/init', async (_req: Request, res: Response) => {
  try {
    const result = await initializeDatabaseSchema();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Database initialization failed', details: error.message });
  }
});

// POST /api/db/seed - Seed sample records
router.post('/seed', async (_req: Request, res: Response) => {
  try {
    const result = await seedSampleData();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Database seeding failed', details: error.message });
  }
});

// GET /api/db/schema - View schema SQL
router.get('/schema', (_req: Request, res: Response) => {
  try {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      res.type('text/plain').send(sql);
    } else {
      res.status(404).send('-- Schema file not found');
    }
  } catch (error: any) {
    res.status(500).send(`-- Error reading schema: ${error.message}`);
  }
});

export default router;
