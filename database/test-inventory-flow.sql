-- Test Data for Complete Inventory Flow
-- Run this in Supabase SQL Editor to create sample data

-- NOTE: Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- You can get your user ID by running: SELECT id FROM auth.users WHERE email = 'your@email.com';

-- 1. Create a test warehouse
INSERT INTO warehouses (id, name, location, address, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Main Warehouse', 'New York', '123 Main St, New York, NY 10001', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create a test supplier
INSERT INTO suppliers (id, name, contact_person, email, phone, address, is_active) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Tech Supplies Inc.', 'John Smith', 'john@techsupplies.com', '(555) 123-4567', '456 Supplier Ave, Los Angeles, CA 90001', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Create test categories
INSERT INTO categories (id, name, description) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Electronics', 'Electronic devices and components'),
  ('44444444-4444-4444-4444-444444444444', 'Office Equipment', 'Office supplies and equipment')
ON CONFLICT (id) DO NOTHING;

-- 4. Create test products (with inventory tracking)
INSERT INTO products (id, sku, name, description, category_id, unit_price, cost_price, reorder_level, reorder_quantity, is_active) VALUES
  ('55555555-5555-5555-5555-555555555555', 'LAPTOP-001', 'Dell Latitude Laptop', 'Business class laptop with 16GB RAM', '33333333-3333-3333-3333-333333333333', 1200.00, 800.00, 5, 10, true),
  ('66666666-6666-6666-6666-666666666666', 'MOUSE-001', 'Wireless Mouse', 'Ergonomic wireless mouse', '33333333-3333-3333-3333-333333333333', 25.00, 12.00, 20, 50, true),
  ('77777777-7777-7777-7777-777777777777', 'DESK-001', 'Standing Desk', 'Adjustable height standing desk', '44444444-4444-4444-4444-444444444444', 450.00, 300.00, 3, 5, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create a test purchase order
-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual user ID
DO $$
DECLARE
    v_user_id UUID;
    v_po_exists BOOLEAN;
BEGIN
    -- Get the first admin/manager/staff user (you can also hardcode your user ID here)
    SELECT id INTO v_user_id FROM profiles WHERE role IN ('admin', 'manager', 'staff') LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'No admin/manager/staff user found. Please update the user_id manually.';
        RETURN;
    END IF;
    
    -- Check if PO already exists
    SELECT EXISTS(SELECT 1 FROM purchase_orders WHERE id = '88888888-8888-8888-8888-888888888888') INTO v_po_exists;
    
    IF NOT v_po_exists THEN
        INSERT INTO purchase_orders (id, po_number, supplier_id, warehouse_id, status, total_amount, expected_date, notes, created_by) VALUES
          ('88888888-8888-8888-8888-888888888888', 'PO-20260130-0001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'draft', 3625.00, CURRENT_DATE + INTERVAL '7 days', 'Initial stock order for testing', v_user_id);
    END IF;
END $$;

-- 6. Create purchase order items
INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, received_quantity) VALUES
  ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 3, 800.00, 0),
  ('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', 50, 12.00, 0),
  ('88888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 2, 300.00, 0)
ON CONFLICT DO NOTHING;

-- 7. Simulate receiving the purchase order (this creates inventory)
DO $$
DECLARE
    v_user_id UUID;
    v_item RECORD;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM profiles WHERE role IN ('admin', 'manager', 'staff') LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'No admin/manager/staff user found. Skipping inventory creation.';
        RETURN;
    END IF;
    
    -- Loop through each purchase order item and create inventory
    FOR v_item IN 
        SELECT product_id, quantity 
        FROM purchase_order_items 
        WHERE po_id = '88888888-8888-8888-8888-888888888888'
    LOOP
        -- Insert or update inventory
        INSERT INTO inventory (product_id, warehouse_id, available_quantity, reserved_quantity)
        VALUES (v_item.product_id, '11111111-1111-1111-1111-111111111111', v_item.quantity, 0)
        ON CONFLICT (product_id, warehouse_id) 
        DO UPDATE SET available_quantity = inventory.available_quantity + v_item.quantity;
        
        -- Create transaction record
        INSERT INTO transactions (product_id, warehouse_id, type, quantity, reference_id, performed_by)
        VALUES (v_item.product_id, '11111111-1111-1111-1111-111111111111', 'restock', v_item.quantity, '88888888-8888-8888-8888-888888888888', v_user_id);
        
        -- Update received quantity
        UPDATE purchase_order_items 
        SET received_quantity = quantity
        WHERE po_id = '88888888-8888-8888-8888-888888888888' 
        AND product_id = v_item.product_id;
    END LOOP;
    
    -- Update purchase order status
    UPDATE purchase_orders 
    SET status = 'received', received_date = CURRENT_DATE
    WHERE id = '88888888-8888-8888-8888-888888888888';
    
    RAISE NOTICE 'Inventory created successfully!';
END $$;

-- Verify inventory was created
SELECT 
    p.name AS product_name,
    p.sku,
    w.name AS warehouse_name,
    i.available_quantity,
    i.reserved_quantity,
    i.total_quantity
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.warehouse_id = '11111111-1111-1111-1111-111111111111'
ORDER BY p.name;

-- Check the result
-- You should see:
-- Dell Latitude Laptop: available=3, reserved=0, total=3
-- Wireless Mouse: available=50, reserved=0, total=50
-- Standing Desk: available=2, reserved=0, total=2
