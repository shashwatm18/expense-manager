-- ====================================================================
-- 3-TIER EXPENSE MANAGER - POSTGRESQL DATABASE SCHEMA
-- ====================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#64748b',
    icon VARCHAR(30) DEFAULT 'Tag',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Credit Card',
    status VARCHAR(20) NOT NULL DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Reimbursed')),
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_name);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_method ON expenses(payment_method);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);

-- 4. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_update_expenses_timestamp ON expenses;
CREATE TRIGGER trg_update_expenses_timestamp
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Seed Default Categories
INSERT INTO categories (name, color, icon) VALUES
    ('Food & Dining', '#f97316', 'Utensils'),
    ('Transportation', '#0ea5e9', 'Car'),
    ('Housing & Rent', '#8b5cf6', 'Home'),
    ('Utilities & Bills', '#eab308', 'Zap'),
    ('Entertainment', '#ec4899', 'Film'),
    ('Healthcare', '#10b981', 'HeartPulse'),
    ('Shopping', '#6366f1', 'ShoppingBag'),
    ('Travel', '#14b8a6', 'Plane'),
    ('Education', '#3b82f6', 'GraduationCap'),
    ('Personal Care', '#f43f5e', 'Sparkles'),
    ('Miscellaneous', '#64748b', 'MoreHorizontal')
ON CONFLICT (name) DO NOTHING;
