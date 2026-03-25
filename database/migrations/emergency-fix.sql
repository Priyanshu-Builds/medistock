-- EMERGENCY FIX: Temporarily disable problematic RLS policies
-- This allows all authenticated users to access data while we fix the recursion
-- Run this in your Supabase SQL Editor NOW

-- Profiles - allow all authenticated users to read
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "All authenticated can read profiles" ON profiles FOR SELECT TO authenticated USING (true);

-- Categories
DROP POLICY IF EXISTS "Admins and managers can manage categories" ON categories;
CREATE POLICY "All authenticated can manage categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products  
DROP POLICY IF EXISTS "Staff+ can create products" ON products;
DROP POLICY IF EXISTS "Managers+ can update products" ON products;
CREATE POLICY "All authenticated can manage products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Warehouses
DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;
CREATE POLICY "All authenticated can manage warehouses" ON warehouses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inventory
DROP POLICY IF EXISTS "Staff+ can update inventory" ON inventory;
CREATE POLICY "All authenticated can manage inventory" ON inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Transactions
DROP POLICY IF EXISTS "Staff+ can create transactions" ON transactions;
CREATE POLICY "All authenticated can manage transactions" ON transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Suppliers
DROP POLICY IF EXISTS "Managers+ can manage suppliers" ON suppliers;
CREATE POLICY "All authenticated can manage suppliers" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Purchase Orders
DROP POLICY IF EXISTS "Staff+ can create POs" ON purchase_orders;
DROP POLICY IF EXISTS "Staff+ can update POs" ON purchase_orders;
CREATE POLICY "All authenticated can manage POs" ON purchase_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Sales Orders
DROP POLICY IF EXISTS "Staff+ can manage sales orders" ON sales_orders;
CREATE POLICY "All authenticated can manage sales orders" ON sales_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Stock Transfers
DROP POLICY IF EXISTS "Staff+ can manage transfers" ON stock_transfers;
CREATE POLICY "All authenticated can manage transfers" ON stock_transfers FOR ALL TO authenticated USING (true) WITH CHECK (true);
