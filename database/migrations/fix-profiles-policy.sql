-- Fix infinite recursion in ALL RLS policies
-- The problem: Policies were querying the profiles table FROM WITHIN profile-checking policies
-- Solution: Use a PostgreSQL function to cache the user's role, avoiding recursion
-- Run this in your Supabase SQL Editor

-- Step 1: Create a function to get current user's role (cached per transaction)
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'viewer'
  )::TEXT;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Step 2: Drop ALL existing policies that have recursion issues
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins and managers can manage categories" ON categories;
DROP POLICY IF EXISTS "Staff+ can create products" ON products;
DROP POLICY IF EXISTS "Managers+ can update products" ON products;
DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;
DROP POLICY IF EXISTS "Staff+ can update inventory" ON inventory;
DROP POLICY IF EXISTS "Staff+ can create transactions" ON transactions;
DROP POLICY IF EXISTS "Managers+ can manage suppliers" ON suppliers;
DROP POLICY IF EXISTS "Staff+ can create POs" ON purchase_orders;
DROP POLICY IF EXISTS "Staff+ can update POs" ON purchase_orders;
DROP POLICY IF EXISTS "Staff+ can manage sales orders" ON sales_orders;
DROP POLICY IF EXISTS "Staff+ can manage transfers" ON stock_transfers;

-- Step 3: Recreate policies using the function (no recursion)

-- Profiles
CREATE POLICY "Authenticated users can view profiles" ON profiles 
  FOR SELECT TO authenticated USING (true);

-- Categories
CREATE POLICY "Admins and managers can manage categories" ON categories 
  FOR ALL USING (public.user_role() IN ('admin', 'manager'))
  WITH CHECK (public.user_role() IN ('admin', 'manager'));

-- Products
CREATE POLICY "Staff+ can create products" ON products 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Managers+ can update products" ON products 
  FOR UPDATE USING (public.user_role() IN ('admin', 'manager'));

-- Warehouses
CREATE POLICY "Admins can manage warehouses" ON warehouses 
  FOR ALL USING (public.user_role() = 'admin')
  WITH CHECK (public.user_role() = 'admin');

-- Inventory
CREATE POLICY "Staff+ can update inventory" ON inventory 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Transactions
CREATE POLICY "Staff+ can create transactions" ON transactions 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Suppliers
CREATE POLICY "Managers+ can manage suppliers" ON suppliers 
  FOR ALL USING (public.user_role() IN ('admin', 'manager'))
  WITH CHECK (public.user_role() IN ('admin', 'manager'));

-- Purchase Orders
CREATE POLICY "Staff+ can create POs" ON purchase_orders 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Staff+ can update POs" ON purchase_orders 
  FOR UPDATE USING (public.user_role() IN ('admin', 'manager', 'staff'));

-- Sales Orders
CREATE POLICY "Staff+ can manage sales orders" ON sales_orders 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Stock Transfers
CREATE POLICY "Staff+ can manage transfers" ON stock_transfers 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));
