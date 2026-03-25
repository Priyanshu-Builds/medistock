# Inventory Flow Fix

## Issue Identified

The sales order creation was failing due to **zero inventory availability**, which was caused by a critical bug in the purchase order receiving functionality.

## Root Cause

The purchase order receiving code (`/src/app/dashboard/purchase-orders/[id]/receive/page.tsx`) had incorrect column names that didn't match the database schema:

### Column Name Mismatches:
1. **`purchase_order_id`** → Should be **`po_id`**
2. **`quantity_on_hand`** → Should be **`available_quantity`**
3. **`quantity_reserved`** → Should be **`reserved_quantity`**
4. **`inventory_transactions`** table → Should be **`transactions`** table
5. **`transaction_type`** column → Should be **`type`** column

These mismatches meant that when you received a purchase order, the inventory records were **never created or updated**, leaving all products with 0 available quantity.

## Files Fixed

### 1. `/src/app/dashboard/purchase-orders/[id]/receive/page.tsx`
- ✅ Fixed `purchase_order_id` → `po_id` (line 69)
- ✅ Fixed `quantity_on_hand` → `available_quantity` (lines 125, 133, 141)
- ✅ Fixed `quantity_reserved` → `reserved_quantity` (line 142)
- ✅ Fixed `inventory_transactions` → `transactions` (line 147)
- ✅ Fixed `transaction_type` → `type` (line 152)
- ✅ Added `performed_by` field for transaction records

### 2. `/src/app/dashboard/purchase-orders/[id]/page.tsx`
- ✅ Fixed `purchase_order_id` → `po_id` (line 93)

### 3. `/src/app/dashboard/sales-orders/sales-order-form.tsx`
- ✅ Added detailed logging for debugging
- ✅ Added clearer error messages for inventory validation failures

## How the Inventory Flow Works (Corrected)

### Step 1: Create a Product
```
Products Table: Product exists but no inventory yet
```

### Step 2: Create a Purchase Order
```
Purchase Orders Table: PO created with status='draft'
Purchase Order Items Table: Items added to PO
Inventory Table: Still empty (no inventory yet)
```

### Step 3: Receive the Purchase Order ⭐ **This is where inventory is created**
```
1. Navigate to Purchase Orders → Click on PO → "Receive Items"
2. Enter quantities to receive
3. System creates/updates inventory records:
   
   Inventory Table:
   ✅ Creates new record if product+warehouse doesn't exist
   ✅ Updates available_quantity if record exists
   
   Transactions Table:
   ✅ Records transaction with type='restock'
```

### Step 4: Create Sales Order
```
1. System checks available_quantity in inventory table
2. If sufficient stock exists:
   ✅ Creates sales order
   ✅ Trigger automatically:
      - Decreases available_quantity
      - Increases reserved_quantity
3. If insufficient stock:
   ❌ Shows error and prevents order creation
```

## Testing the Complete Flow

### 1. Create a Product
```
Dashboard → Products → New Product
- Fill in product details
- Make sure to set a unit_price (this will be used in orders)
```

### 2. Create a Purchase Order
```
Dashboard → Purchase Orders → New Purchase Order
- Select a supplier (create one first if needed)
- Select a warehouse (create one first if needed)
- Add the product you just created
- Enter quantity (e.g., 100 units)
- Submit the purchase order
```

### 3. Receive the Purchase Order
```
Dashboard → Purchase Orders → Click on your PO → "Receive Items"
- Enter the quantity to receive (e.g., 100)
- Click "Receive Items"
- ✅ This creates inventory records!
```

### 4. Verify Inventory
```
Dashboard → Inventory
- You should see your product listed with available_quantity = 100
```

### 5. Create a Sales Order
```
Dashboard → Sales Orders → New Sales Order
- Fill in customer details
- Select the same warehouse
- Add the product
- Enter quantity (must be ≤ available inventory)
- Click "Create Sales Order"
- ✅ Sales order created successfully!
```

## Database Trigger Behavior

The database has an automatic trigger that runs when a sales order item is created:

```sql
CREATE OR REPLACE FUNCTION reserve_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory
  SET available_quantity = available_quantity - NEW.quantity,
      reserved_quantity = reserved_quantity + NEW.quantity
  WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id
    AND available_quantity >= NEW.quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory for product % at warehouse %', 
                    NEW.product_id, NEW.warehouse_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

This trigger ensures that:
- Inventory is automatically reserved when a sales order is created
- The system prevents overselling by checking available quantity
- The transaction is atomic (all or nothing)

## Next Steps

1. ✅ **All fixes have been applied**
2. 🧪 **Test the complete flow**:
   - Create a product
   - Create and receive a purchase order
   - Verify inventory was created
   - Create a sales order
3. 🎉 **Sales orders should now work correctly!**

## Prevention

To prevent similar issues in the future:
- Always reference the `supabase-schema.sql` file for correct column names
- Use TypeScript types from `database.types.ts` for type safety
- Test the complete flow end-to-end after any schema changes
