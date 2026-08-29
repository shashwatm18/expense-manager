-- ====================================================================
-- 3-TIER EXPENSE MANAGER - SAMPLE SEED DATA
-- ====================================================================

INSERT INTO expenses (title, amount, category_name, date, payment_method, status, notes) VALUES
    ('Grocery Store - Whole Foods', 142.50, 'Food & Dining', CURRENT_DATE - INTERVAL '1 day', 'Credit Card', 'Paid', 'Weekly household groceries and produce'),
    ('Monthly Apartment Rent', 1450.00, 'Housing & Rent', CURRENT_DATE - INTERVAL '3 days', 'Bank Transfer', 'Paid', 'Standard monthly rent payment'),
    ('Electric & Gas Utility Bill', 88.40, 'Utilities & Bills', CURRENT_DATE - INTERVAL '5 days', 'Debit Card', 'Paid', 'City power and heating bill'),
    ('High-speed Fiber Internet', 65.00, 'Utilities & Bills', CURRENT_DATE - INTERVAL '6 days', 'Credit Card', 'Paid', 'Monthly Gigabit internet package'),
    ('Gasoline Station Refill', 48.75, 'Transportation', CURRENT_DATE - INTERVAL '2 days', 'Credit Card', 'Paid', 'Full tank unleaded fuel'),
    ('Metro Monthly Transit Pass', 75.00, 'Transportation', CURRENT_DATE - INTERVAL '12 days', 'Debit Card', 'Paid', 'Subway & bus monthly pass'),
    ('Weekend Dinner with Friends', 96.20, 'Food & Dining', CURRENT_DATE - INTERVAL '4 days', 'Credit Card', 'Paid', 'Italian restaurant trattoria dinner'),
    ('Coffee & Pastry', 8.50, 'Food & Dining', CURRENT_DATE, 'Apple Pay / UPI', 'Paid', 'Morning cappuccino and croissant'),
    ('Cinema Movie Tickets', 34.00, 'Entertainment', CURRENT_DATE - INTERVAL '7 days', 'Credit Card', 'Paid', '2x IMAX tickets for Friday night movie'),
    ('Pharmacy Prescription & Vitamins', 27.90, 'Healthcare', CURRENT_DATE - INTERVAL '9 days', 'Debit Card', 'Paid', 'Prescription refill and multivitamins'),
    ('New Ergonomic Office Chair', 229.00, 'Shopping', CURRENT_DATE - INTERVAL '15 days', 'Credit Card', 'Paid', 'Home workspace equipment upgrade'),
    ('Online Web Dev Course Subscription', 39.99, 'Education', CURRENT_DATE - INTERVAL '18 days', 'Credit Card', 'Paid', 'Annual continuing learning platform'),
    ('Dentist Routine Checkup', 120.00, 'Healthcare', CURRENT_DATE - INTERVAL '20 days', 'Debit Card', 'Reimbursed', 'Annual teeth cleaning & examination'),
    ('Weekend Getaway Train Ticket', 84.00, 'Travel', CURRENT_DATE - INTERVAL '22 days', 'Credit Card', 'Paid', 'Roundtrip express rail ticket'),
    ('Gym Monthly Membership', 45.00, 'Personal Care', CURRENT_DATE - INTERVAL '25 days', 'Debit Card', 'Paid', 'Fitness center monthly recurring dues');
