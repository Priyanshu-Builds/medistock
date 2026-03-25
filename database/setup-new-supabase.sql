-- =====================================================
-- COMPLETE DATABASE SETUP FOR NEW SUPABASE PROJECT
-- Run this ENTIRE script once in Supabase SQL Editor
-- =====================================================

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'staff', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO authenticated USING (true);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  image_url TEXT,
  barcode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated USING (true);

-- ============================================
-- 4. PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images" ON product_images 
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- 5. WAREHOUSES TABLE
-- ============================================
CREATE TABLE warehouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  capacity INTEGER,
  manager_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view warehouses" ON warehouses FOR SELECT TO authenticated USING (true);

-- ============================================
-- 6. INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE NOT NULL,
  available_quantity INTEGER NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  total_quantity INTEGER GENERATED ALWAYS AS (available_quantity + reserved_quantity) STORED,
  last_counted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);

-- ============================================
-- 7. TRANSACTIONS TABLE
-- ============================================
CREATE TYPE transaction_type AS ENUM ('restock', 'sale', 'return', 'adjustment', 'transfer_out', 'transfer_in');

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id UUID,
  reason TEXT,
  performed_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transactions" ON transactions FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================
-- 8. SUPPLIERS TABLE
-- ============================================
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view suppliers" ON suppliers FOR SELECT TO authenticated USING (true);

-- ============================================
-- 9. PURCHASE ORDERS TABLE
-- ============================================
CREATE TYPE po_status AS ENUM ('draft', 'sent', 'partial', 'received', 'cancelled');

CREATE TABLE purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  status po_status NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expected_date DATE,
  received_date DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view POs" ON purchase_orders FOR SELECT TO authenticated USING (true);

-- ============================================
-- 10. PURCHASE ORDER ITEMS TABLE
-- ============================================
CREATE TABLE purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  received_quantity INTEGER NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inherit from purchase_orders" ON purchase_order_items FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 11. SALES ORDERS TABLE
-- ============================================
CREATE TYPE sales_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

CREATE TABLE sales_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  status sales_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfillment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sales orders" ON sales_orders FOR SELECT TO authenticated USING (true);

-- ============================================
-- 12. SALES ORDER ITEMS TABLE
-- ============================================
CREATE TABLE sales_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inherit from sales_orders" ON sales_order_items FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 13. STOCK TRANSFERS TABLE
-- ============================================
CREATE TYPE transfer_status AS ENUM ('pending', 'in_transit', 'completed', 'cancelled');

CREATE TABLE stock_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_number TEXT UNIQUE NOT NULL,
  from_warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  to_warehouse_id UUID REFERENCES warehouses(id) NOT NULL,
  status transfer_status NOT NULL DEFAULT 'pending',
  transfer_date DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (from_warehouse_id != to_warehouse_id)
);

ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transfers" ON stock_transfers FOR SELECT TO authenticated USING (true);

-- ============================================
-- 14. STOCK TRANSFER ITEMS TABLE
-- ============================================
CREATE TABLE stock_transfer_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_id UUID REFERENCES stock_transfers(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inherit from stock_transfers" ON stock_transfer_items FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON sales_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_transfers_updated_at BEFORE UPDATE ON stock_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure single primary image per product
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE product_images SET is_primary = false
    WHERE product_id = NEW.product_id AND id != NEW.id AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_image_trigger
  BEFORE INSERT OR UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_image();

-- Reserve inventory on sales order
CREATE OR REPLACE FUNCTION reserve_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory
  SET available_quantity = available_quantity - NEW.quantity,
      reserved_quantity = reserved_quantity + NEW.quantity
  WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id
    AND available_quantity >= NEW.quantity;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory for product % at warehouse %', NEW.product_id, NEW.warehouse_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reserve_inventory_trigger
AFTER INSERT ON sales_order_items
FOR EACH ROW EXECUTE FUNCTION reserve_inventory_on_order();

-- ============================================
-- ROLE HELPER FUNCTIONS (prevent RLS recursion)
-- ============================================

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'viewer'
  )::TEXT;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN COALESCE(user_role, '') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_role() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- ============================================
-- RLS POLICIES (using helper functions)
-- ============================================

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated users can view profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Categories (write)
CREATE POLICY "Admins and managers can manage categories" ON categories 
  FOR ALL USING (public.user_role() IN ('admin', 'manager'))
  WITH CHECK (public.user_role() IN ('admin', 'manager'));

-- Products (write)
CREATE POLICY "Staff+ can create products" ON products 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));
CREATE POLICY "Managers+ can update products" ON products 
  FOR UPDATE USING (public.user_role() IN ('admin', 'manager'));

-- Product Images (write)
CREATE POLICY "Staff+ can create product images" ON product_images 
  FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));
CREATE POLICY "Managers+ can update product images" ON product_images 
  FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'manager'));
CREATE POLICY "Managers+ can delete product images" ON product_images 
  FOR DELETE TO authenticated USING (public.user_role() IN ('admin', 'manager'));

-- Warehouses (write)
CREATE POLICY "Admins can manage warehouses" ON warehouses 
  FOR ALL USING (public.user_role() = 'admin')
  WITH CHECK (public.user_role() = 'admin');

-- Inventory (write)
CREATE POLICY "Staff+ can update inventory" ON inventory 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Transactions (write)
CREATE POLICY "Staff+ can create transactions" ON transactions 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Suppliers (write)
CREATE POLICY "Managers+ can manage suppliers" ON suppliers 
  FOR ALL USING (public.user_role() IN ('admin', 'manager'))
  WITH CHECK (public.user_role() IN ('admin', 'manager'));

-- Purchase Orders (write)
CREATE POLICY "Staff+ can create POs" ON purchase_orders 
  FOR INSERT WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));
CREATE POLICY "Staff+ can update POs" ON purchase_orders 
  FOR UPDATE USING (public.user_role() IN ('admin', 'manager', 'staff'));

-- Sales Orders (write)
CREATE POLICY "Staff+ can manage sales orders" ON sales_orders 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- Stock Transfers (write)
CREATE POLICY "Staff+ can manage transfers" ON stock_transfers 
  FOR ALL USING (public.user_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (public.user_role() IN ('admin', 'manager', 'staff'));

-- ============================================
-- VIEWS
-- ============================================

CREATE VIEW low_stock_alerts AS
SELECT 
  p.id, p.sku, p.name, p.reorder_level,
  w.name as warehouse_name,
  i.available_quantity, i.reserved_quantity, i.total_quantity
FROM products p
JOIN inventory i ON p.id = i.product_id
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.total_quantity <= p.reorder_level
  AND p.is_active = true AND w.is_active = true
ORDER BY i.total_quantity ASC;

CREATE VIEW inventory_value_by_warehouse AS
SELECT 
  w.id as warehouse_id, w.name as warehouse_name,
  COUNT(DISTINCT i.product_id) as total_products,
  SUM(i.total_quantity * p.cost_price) as total_value
FROM warehouses w
LEFT JOIN inventory i ON w.id = i.warehouse_id
LEFT JOIN products p ON i.product_id = p.id
WHERE w.is_active = true
GROUP BY w.id, w.name
ORDER BY total_value DESC;

-- ============================================
-- SAMPLE DATA (Medicine categories)
-- ============================================
INSERT INTO categories (name, description) VALUES
  ('Antibiotics', 'Antibacterial medicines'),
  ('Painkillers', 'Pain relief medicines'),
  ('Vitamins', 'Vitamin supplements'),
  ('First Aid', 'First aid supplies'),
  ('Cardiac', 'Heart and cardiovascular medicines'),
  ('Respiratory', 'Respiratory system medicines');
