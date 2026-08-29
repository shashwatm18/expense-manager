import { Router, Request, Response } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  getStats,
} from '../db.js';

const router = Router();

// GET /api/expenses - List and filter expenses
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      payment_method,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy,
      order,
      page,
      limit,
    } = req.query;

    const data = await getExpenses({
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      payment_method: payment_method ? String(payment_method) : undefined,
      status: status ? String(status) : undefined,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      minAmount: minAmount ? parseFloat(String(minAmount)) : undefined,
      maxAmount: maxAmount ? parseFloat(String(maxAmount)) : undefined,
      sortBy: sortBy ? String(sortBy) : 'date',
      order: order === 'asc' ? 'asc' : 'desc',
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 50,
    });

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses', details: error.message });
  }
});

// GET /api/expenses/stats - Aggregated stats and breakdown
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate expense statistics', details: error.message });
  }
});

// GET /api/expenses/categories - List categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to retrieve categories', details: error.message });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid expense ID' });
      return;
    }

    const expense = await getExpenseById(id);
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    res.json(expense);
  } catch (error: any) {
    console.error('Error fetching expense by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve expense', details: error.message });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, amount, category_name, category_id, date, payment_method, status, notes, receipt_url } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ error: 'Amount must be a positive number greater than zero' });
      return;
    }

    const newExpense = await createExpense({
      title: title.trim(),
      amount: parsedAmount,
      category_name: category_name || 'Miscellaneous',
      category_id: category_id || null,
      date: date || new Date().toISOString().split('T')[0],
      payment_method: payment_method || 'Credit Card',
      status: status || 'Paid',
      notes: notes ? notes.trim() : null,
      receipt_url: receipt_url ? receipt_url.trim() : null,
    });

    res.status(201).json(newExpense);
  } catch (error: any) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense', details: error.message });
  }
});

// PUT /api/expenses/:id - Update existing expense
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid expense ID' });
      return;
    }

    const { title, amount, category_name, category_id, date, payment_method, status, notes, receipt_url } = req.body;

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ error: 'Amount must be a positive number greater than zero' });
        return;
      }
    }

    const updated = await updateExpense(id, {
      title: title ? title.trim() : undefined,
      amount: amount !== undefined ? parseFloat(amount) : undefined,
      category_name,
      category_id,
      date,
      payment_method,
      status,
      notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
      receipt_url: receipt_url !== undefined ? (receipt_url ? receipt_url.trim() : null) : undefined,
    });

    if (!updated) {
      res.status(404).json({ error: 'Expense not found to update' });
      return;
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense', details: error.message });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid expense ID' });
      return;
    }

    const success = await deleteExpense(id);
    if (!success) {
      res.status(404).json({ error: 'Expense not found to delete' });
      return;
    }

    res.json({ message: 'Expense deleted successfully', id });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense', details: error.message });
  }
});

export default router;
