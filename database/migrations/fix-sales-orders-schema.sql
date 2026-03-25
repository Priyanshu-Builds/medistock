-- Fix for Sales Orders: Add missing fields
-- Run this in your Supabase SQL Editor

-- Add shipping_address field to sales_orders table
ALTER TABLE sales_orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- Add warehouse_id field to sales_orders table (referenced in the form)
ALTER TABLE sales_orders 
ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES warehouses(id);

-- Add total_price field to sales_order_items (for pre-calculated totals)
ALTER TABLE sales_order_items 
ADD COLUMN IF NOT EXISTS total_price DECIMAL(12, 2);

-- Update existing records to calculate total_price
UPDATE sales_order_items 
SET total_price = quantity * unit_price 
WHERE total_price IS NULL;

-- Verify the changes for sales_orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'sales_orders'
ORDER BY ordinal_position;

-- Verify the changes for sales_order_items
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'sales_order_items'
ORDER BY ordinal_position;
