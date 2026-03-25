# Role-Based Access Control - Detailed Permissions Guide

## 📋 Role Hierarchy

1. **Admin** - Full system access (highest privileges)
2. **Manager** - Operational management (products, suppliers, orders)
3. **Staff** - Day-to-day operations (create orders, manage inventory)
4. **Viewer** - Read-only access (lowest privileges)

---

## 🔐 ADMIN ROLE - Full System Access

### ✅ **Full Access To:**

#### **Dashboard**
- ✅ View all KPIs and statistics
- ✅ View all widgets and charts
- ✅ Access all dashboard features

#### **Products Management**
- ✅ **View** all products
- ✅ **Create** new products
- ✅ **Edit** existing products (name, price, description, etc.)
- ✅ **Delete** products
- ✅ **View** product details
- ✅ **Generate** barcodes/QR codes
- ✅ **Upload** product images

#### **Warehouses Management**
- ✅ **View** all warehouses
- ✅ **Create** new warehouses
- ✅ **Edit** warehouse details (name, location, capacity, manager)
- ✅ **Delete** warehouses
- ✅ **View** warehouse inventory details
- ✅ **Assign** warehouse managers

#### **Suppliers Management**
- ✅ **View** all suppliers
- ✅ **Create** new suppliers
- ✅ **Edit** supplier information
- ✅ **Delete** suppliers
- ✅ **View** supplier purchase order history

#### **Categories Management**
- ✅ **View** all categories
- ✅ **Create** new categories
- ✅ **Edit** categories
- ✅ **Delete** categories
- ✅ **Manage** category hierarchy

#### **Purchase Orders**
- ✅ **View** all purchase orders
- ✅ **Create** purchase orders
- ✅ **Edit** purchase orders
- ✅ **Update** purchase order status
- ✅ **Receive** items (mark as received)
- ✅ **Cancel** purchase orders
- ✅ **View** purchase order details

#### **Sales Orders**
- ✅ **View** all sales orders
- ✅ **Create** sales orders
- ✅ **Edit** sales orders
- ✅ **Process** orders (mark as processing)
- ✅ **Ship** orders (mark as shipped)
- ✅ **Deliver** orders (mark as delivered)
- ✅ **Cancel** orders
- ✅ **Generate** invoices (PDF)
- ✅ **View** sales order details

#### **Stock Transfers**
- ✅ **View** all stock transfers
- ✅ **Create** stock transfers
- ✅ **Edit** stock transfers
- ✅ **Approve** transfers
- ✅ **Complete** transfers
- ✅ **Cancel** transfers
- ✅ **View** transfer details

#### **Inventory Management**
- ✅ **View** all inventory across all warehouses
- ✅ **Update** inventory quantities
- ✅ **Adjust** inventory (manual adjustments)
- ✅ **View** inventory transactions
- ✅ **Track** inventory movements

#### **Reports & Analytics**
- ✅ **View** all reports:
  - Inventory Valuation
  - Stock Movement
  - Low Stock Alerts
  - Sales Analytics
  - Purchase Analytics
- ✅ **Export** reports (CSV, PDF)
- ✅ **Filter** by date ranges
- ✅ **View** all charts and visualizations

#### **Settings**
- ✅ **View** own profile
- ✅ **Edit** own profile (name, email)
- ✅ **Change** password
- ✅ **User Management** (Admin-only):
  - View all users
  - Change user roles
  - View user activity
- ✅ **System Settings** (if implemented)

#### **Transactions**
- ✅ **View** all transaction history
- ✅ **Create** manual transactions
- ✅ **View** transaction details
- ✅ **Filter** transactions by type, date, warehouse

---

## 👔 MANAGER ROLE - Operational Management

### ✅ **Full Access To:**

#### **Dashboard**
- ✅ View all KPIs and statistics
- ✅ View all widgets and charts
- ✅ Access all dashboard features

#### **Products Management**
- ✅ **View** all products
- ✅ **Create** new products
- ✅ **Edit** existing products (name, price, description, etc.)
- ✅ **Delete** products
- ✅ **View** product details
- ✅ **Generate** barcodes/QR codes
- ✅ **Upload** product images

#### **Suppliers Management**
- ✅ **View** all suppliers
- ✅ **Create** new suppliers
- ✅ **Edit** supplier information
- ✅ **Delete** suppliers
- ✅ **View** supplier purchase order history

#### **Categories Management**
- ✅ **View** all categories
- ✅ **Create** new categories
- ✅ **Edit** categories
- ✅ **Delete** categories
- ✅ **Manage** category hierarchy

#### **Purchase Orders**
- ✅ **View** all purchase orders
- ✅ **Create** purchase orders
- ✅ **Edit** purchase orders
- ✅ **Update** purchase order status
- ✅ **Receive** items (mark as received)
- ✅ **Cancel** purchase orders
- ✅ **View** purchase order details

#### **Sales Orders**
- ✅ **View** all sales orders
- ✅ **Create** sales orders
- ✅ **Edit** sales orders
- ✅ **Process** orders (mark as processing)
- ✅ **Ship** orders (mark as shipped)
- ✅ **Deliver** orders (mark as delivered)
- ✅ **Cancel** orders
- ✅ **Generate** invoices (PDF)
- ✅ **View** sales order details

#### **Stock Transfers**
- ✅ **View** all stock transfers
- ✅ **Create** stock transfers
- ✅ **Edit** stock transfers
- ✅ **Approve** transfers
- ✅ **Complete** transfers
- ✅ **Cancel** transfers
- ✅ **View** transfer details

#### **Inventory Management**
- ✅ **View** all inventory across all warehouses
- ✅ **Update** inventory quantities
- ✅ **Adjust** inventory (manual adjustments)
- ✅ **View** inventory transactions
- ✅ **Track** inventory movements

#### **Reports & Analytics**
- ✅ **View** all reports:
  - Inventory Valuation
  - Stock Movement
  - Low Stock Alerts
  - Sales Analytics
  - Purchase Analytics
- ✅ **Export** reports (CSV, PDF)
- ✅ **Filter** by date ranges
- ✅ **View** all charts and visualizations

#### **Settings**
- ✅ **View** own profile
- ✅ **Edit** own profile (name, email)
- ✅ **Change** password
- ❌ **User Management** (Admin only)

#### **Transactions**
- ✅ **View** all transaction history
- ✅ **Create** manual transactions
- ✅ **View** transaction details
- ✅ **Filter** transactions by type, date, warehouse

### ❌ **Restricted Access:**

#### **Warehouses Management**
- ✅ **View** all warehouses
- ❌ **Create** warehouses (Admin only)
- ❌ **Edit** warehouses (Admin only)
- ❌ **Delete** warehouses (Admin only)
- ✅ **View** warehouse inventory details (read-only)

---

## 👷 STAFF ROLE - Day-to-Day Operations

### ✅ **Full Access To:**

#### **Dashboard**
- ✅ View all KPIs and statistics
- ✅ View all widgets and charts
- ✅ Access all dashboard features

#### **Products Management**
- ✅ **View** all products
- ✅ **Create** new products
- ❌ **Edit** existing products (Manager+ only)
- ❌ **Delete** products (Manager+ only)
- ✅ **View** product details
- ✅ **Generate** barcodes/QR codes
- ✅ **Upload** product images

#### **Purchase Orders**
- ✅ **View** all purchase orders
- ✅ **Create** purchase orders
- ✅ **Edit** purchase orders
- ✅ **Update** purchase order status
- ✅ **Receive** items (mark as received)
- ✅ **Cancel** purchase orders
- ✅ **View** purchase order details

#### **Sales Orders**
- ✅ **View** all sales orders
- ✅ **Create** sales orders
- ✅ **Edit** sales orders
- ✅ **Process** orders (mark as processing)
- ✅ **Ship** orders (mark as shipped)
- ✅ **Deliver** orders (mark as delivered)
- ✅ **Cancel** orders
- ✅ **Generate** invoices (PDF)
- ✅ **View** sales order details

#### **Stock Transfers**
- ✅ **View** all stock transfers
- ✅ **Create** stock transfers
- ✅ **Edit** stock transfers
- ✅ **Approve** transfers
- ✅ **Complete** transfers
- ✅ **Cancel** transfers
- ✅ **View** transfer details

#### **Inventory Management**
- ✅ **View** all inventory across all warehouses
- ✅ **Update** inventory quantities (via orders/transfers only)
- ❌ **Manual adjustments** (Manager+ only)
- ✅ **View** inventory transactions
- ✅ **Track** inventory movements

#### **Reports & Analytics**
- ✅ **View** all reports:
  - Inventory Valuation
  - Stock Movement
  - Low Stock Alerts
  - Sales Analytics
  - Purchase Analytics
- ✅ **Export** reports (CSV, PDF)
- ✅ **Filter** by date ranges
- ✅ **View** all charts and visualizations

#### **Settings**
- ✅ **View** own profile
- ✅ **Edit** own profile (name, email)
- ✅ **Change** password
- ❌ **User Management** (Admin only)

#### **Transactions**
- ✅ **View** all transaction history
- ✅ **View** transaction details
- ✅ **Filter** transactions by type, date, warehouse

### ❌ **Restricted Access:**

#### **Warehouses Management**
- ✅ **View** all warehouses
- ❌ **Create** warehouses (Admin only)
- ❌ **Edit** warehouses (Admin only)
- ❌ **Delete** warehouses (Admin only)
- ✅ **View** warehouse inventory details (read-only)

#### **Suppliers Management**
- ✅ **View** all suppliers
- ❌ **Create** suppliers (Manager+ only)
- ❌ **Edit** suppliers (Manager+ only)
- ❌ **Delete** suppliers (Manager+ only)
- ✅ **View** supplier purchase order history (read-only)

#### **Categories Management**
- ✅ **View** all categories
- ❌ **Create** categories (Manager+ only)
- ❌ **Edit** categories (Manager+ only)
- ❌ **Delete** categories (Manager+ only)

#### **Products Management**
- ✅ **View** all products
- ✅ **Create** products
- ❌ **Edit** products (Manager+ only)
- ❌ **Delete** products (Manager+ only)

---

## 👁️ VIEWER ROLE - Read-Only Access

### ✅ **Read-Only Access To:**

#### **Dashboard**
- ✅ View all KPIs and statistics
- ✅ View all widgets and charts
- ✅ Access all dashboard features (read-only)

#### **Products Management**
- ✅ **View** all products
- ✅ **View** product details
- ✅ **View** barcodes/QR codes
- ❌ **Create** products
- ❌ **Edit** products
- ❌ **Delete** products
- ❌ **Upload** product images

#### **Warehouses Management**
- ✅ **View** all warehouses
- ✅ **View** warehouse inventory details
- ❌ **Create** warehouses
- ❌ **Edit** warehouses
- ❌ **Delete** warehouses

#### **Suppliers Management**
- ✅ **View** all suppliers
- ✅ **View** supplier purchase order history
- ❌ **Create** suppliers
- ❌ **Edit** suppliers
- ❌ **Delete** suppliers

#### **Categories Management**
- ✅ **View** all categories
- ❌ **Create** categories
- ❌ **Edit** categories
- ❌ **Delete** categories

#### **Purchase Orders**
- ✅ **View** all purchase orders
- ✅ **View** purchase order details
- ❌ **Create** purchase orders
- ❌ **Edit** purchase orders
- ❌ **Update** purchase order status
- ❌ **Receive** items
- ❌ **Cancel** purchase orders

#### **Sales Orders**
- ✅ **View** all sales orders
- ✅ **View** sales order details
- ✅ **View** invoices (read-only)
- ❌ **Create** sales orders
- ❌ **Edit** sales orders
- ❌ **Process** orders
- ❌ **Ship** orders
- ❌ **Deliver** orders
- ❌ **Cancel** orders
- ❌ **Generate** invoices

#### **Stock Transfers**
- ✅ **View** all stock transfers
- ✅ **View** transfer details
- ❌ **Create** stock transfers
- ❌ **Edit** stock transfers
- ❌ **Approve** transfers
- ❌ **Complete** transfers
- ❌ **Cancel** transfers

#### **Inventory Management**
- ✅ **View** all inventory across all warehouses
- ✅ **View** inventory transactions
- ✅ **Track** inventory movements
- ❌ **Update** inventory quantities (read-only)
- ❌ **Manual adjustments** (Manager+ only)
- ❌ **Create** transactions (Staff+ only)

#### **Reports & Analytics**
- ✅ **View** all reports:
  - Inventory Valuation
  - Stock Movement
  - Low Stock Alerts
  - Sales Analytics
  - Purchase Analytics
- ✅ **Export** reports (CSV, PDF)
- ✅ **Filter** by date ranges
- ✅ **View** all charts and visualizations

#### **Settings**
- ✅ **View** own profile
- ✅ **Edit** own profile (name, email)
- ✅ **Change** password
- ❌ **User Management** (Admin only)

#### **Transactions**
- ✅ **View** all transaction history
- ✅ **View** transaction details
- ✅ **Filter** transactions by type, date, warehouse
- ❌ **Create** manual transactions

---

## 📊 Quick Reference Table

| Feature | Viewer | Staff | Manager | Admin |
|---------|:------:|:-----:|:-------:|:-----:|
| **DASHBOARD** |
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| **PRODUCTS** |
| View Products | ✅ | ✅ | ✅ | ✅ |
| Create Products | ❌ | ✅ | ✅ | ✅ |
| Edit Products | ❌ | ❌ | ✅ | ✅ |
| Delete Products | ❌ | ❌ | ✅ | ✅ |
| **WAREHOUSES** |
| View Warehouses | ✅ | ✅ | ✅ | ✅ |
| Create Warehouses | ❌ | ❌ | ❌ | ✅ |
| Edit Warehouses | ❌ | ❌ | ❌ | ✅ |
| Delete Warehouses | ❌ | ❌ | ❌ | ✅ |
| **SUPPLIERS** |
| View Suppliers | ✅ | ✅ | ✅ | ✅ |
| Create Suppliers | ❌ | ❌ | ✅ | ✅ |
| Edit Suppliers | ❌ | ❌ | ✅ | ✅ |
| Delete Suppliers | ❌ | ❌ | ✅ | ✅ |
| **CATEGORIES** |
| View Categories | ✅ | ✅ | ✅ | ✅ |
| Manage Categories | ❌ | ❌ | ✅ | ✅ |
| **PURCHASE ORDERS** |
| View Purchase Orders | ✅ | ✅ | ✅ | ✅ |
| Create Purchase Orders | ❌ | ✅ | ✅ | ✅ |
| Edit/Update Purchase Orders | ❌ | ✅ | ✅ | ✅ |
| Receive Items | ❌ | ✅ | ✅ | ✅ |
| **SALES ORDERS** |
| View Sales Orders | ✅ | ✅ | ✅ | ✅ |
| Create Sales Orders | ❌ | ✅ | ✅ | ✅ |
| Edit/Update Sales Orders | ❌ | ✅ | ✅ | ✅ |
| Process/Ship/Deliver Orders | ❌ | ✅ | ✅ | ✅ |
| Generate Invoices | ❌ | ✅ | ✅ | ✅ |
| **STOCK TRANSFERS** |
| View Stock Transfers | ✅ | ✅ | ✅ | ✅ |
| Create Stock Transfers | ❌ | ✅ | ✅ | ✅ |
| Edit/Complete Transfers | ❌ | ✅ | ✅ | ✅ |
| **INVENTORY** |
| View Inventory | ✅ | ✅ | ✅ | ✅ |
| Update Inventory (via orders/transfers) | ❌ | ✅ | ✅ | ✅ |
| Manual Inventory Adjustments | ❌ | ❌ | ✅ | ✅ |
| Create Transactions | ❌ | ❌ | ✅ | ✅ |
| **REPORTS** |
| View All Reports | ✅ | ✅ | ✅ | ✅ |
| Export Reports | ✅ | ✅ | ✅ | ✅ |
| **SETTINGS** |
| View Own Profile | ✅ | ✅ | ✅ | ✅ |
| Edit Own Profile | ✅ | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |
| **TRANSACTIONS** |
| View Transactions | ✅ | ✅ | ✅ | ✅ |
| Create Manual Transactions | ❌ | ❌ | ✅ | ✅ |

---

## 🔒 Security Enforcement

### **Database Level (RLS Policies)**
- ✅ All tables have Row Level Security enabled
- ✅ Policies enforce role-based access at database level
- ✅ Users cannot bypass UI restrictions via direct API calls

### **UI Level**
- ✅ Buttons disabled for unauthorized actions
- ✅ Clear toast notifications explaining restrictions
- ✅ Consistent user experience across all modules

### **Key Security Points:**
1. **Role Changes:** Only admins can change user roles (enforced by trigger + RLS)
2. **Warehouse Management:** Only admins can create/edit/delete warehouses
3. **Supplier Management:** Only managers+ can manage suppliers
4. **Product Editing:** Only managers+ can edit/delete products
5. **User Management:** Only admins can access user management page

---

## 📝 Notes

### **What "View" Means:**
- Can see all data in lists/tables
- Can view detail pages
- Can export data
- Cannot modify anything

### **What "Create" Means:**
- Can create new records
- Can add items to orders
- Can initiate processes

### **What "Edit" Means:**
- Can modify existing records
- Can update statuses
- Can change values

### **What "Delete" Means:**
- Can permanently remove records
- Usually requires confirmation
- May have cascade effects

### **Special Cases:**
- **Inventory Updates:** 
  - Staff can update inventory through orders/transfers only
  - Manual adjustments (increase/decrease buttons) require Manager+ role
  - Viewers have read-only access to inventory
- **Order Status Changes:** Staff+ can change order statuses as part of workflow
- **Reports:** All roles can view and export reports (read-only data)
- **Transactions:** Only Staff+ can create transactions; Viewers can only view

---

## 🎯 Role Use Cases

### **Admin**
- System administrators
- IT managers
- Business owners
- Full system control

### **Manager**
- Operations managers
- Department heads
- Senior staff
- Product/supplier management

### **Staff**
- Warehouse workers
- Sales staff
- Order processors
- Day-to-day operations

### **Viewer**
- Auditors
- Accountants
- Executives (read-only)
- External consultants

---

**This document reflects the current implementation as of the latest security fixes.**
