<div align="center">

# 💊 MediStock

**Modern Medicine Inventory Management System**

Built with Next.js, Supabase, and shadcn/ui

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Overview

MediStock is a full-featured, production-ready medicine inventory management system designed for pharmacies, hospitals, and medical stores. It provides real-time inventory tracking, multi-warehouse management, purchase & sales order workflows, and role-based access control — all wrapped in a modern, responsive UI.

---

## ✨ Features

### Core Modules
- **Product Management** — CRUD with SKU, barcode/QR code generation, image upload
- **Warehouse Management** — Multi-location inventory tracking
- **Inventory Tracking** — Real-time stock levels with low-stock alerts
- **Purchase Orders** — Full workflow: draft → sent → received (auto-updates inventory)
- **Sales Orders** — Fulfillment pipeline with PDF invoice generation
- **Stock Transfers** — Move inventory between warehouses with tracking
- **Suppliers** — Contact management and purchase history
- **Reports & Analytics** — Inventory valuation, low stock, sales & purchase analytics, stock movement

### Advanced Features
- 🔐 **Authentication & RBAC** — Role-based access (Admin, Manager, Staff, Viewer)
- 📊 **Real-time Dashboard** — KPI cards, recent transactions, live updates
- 📷 **Drag & Drop Image Upload** — Via Supabase Storage
- 📄 **PDF Invoice Generation** — Professional sales invoices
- 📦 **Barcode & QR Code** — Generate and download for products
- 📥 **CSV Export** — Export inventory reports
- 🌙 **Dark Mode** — Full dark mode support
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix UI) |
| **Backend & DB** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **State Management** | Zustand, TanStack React Query |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **PDF Generation** | jsPDF + jspdf-autotable |
| **Forms** | React Hook Form + Zod validation |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Supabase](https://supabase.com/) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Priyanshu-Builds/medistock.git
cd medistock
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema file:
   - Execute everything in `database/setup-new-supabase.sql`
3. Create a **Storage bucket**:
   - Go to Storage → Create bucket → Name: `product-images` → Make it **public**

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> You can find your keys in Supabase → **Settings** → **API**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your Account

- Click **Sign up** on the landing page
- Enter your email, password, and name
- The first user gets **viewer** role by default — update to **admin** via Supabase SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 📁 Project Structure

```
medistock/
├── database/               # Database scripts
│   ├── setup-new-supabase.sql    # Main schema (run this first)
│   ├── supabase-schema.sql       # Alternative schema reference
│   ├── storage-setup.sql         # Storage bucket setup
│   ├── test-inventory-flow.sql   # Test data scripts
│   └── migrations/               # Incremental fixes & migrations
├── docs/                   # Project documentation
├── public/                 # Static assets
│   ├── favicon.ico
│   └── landing-hero.gif
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── auth/           # Auth callback
│   │   ├── dashboard/      # Main app pages
│   │   │   ├── products/
│   │   │   ├── warehouses/
│   │   │   ├── inventory/
│   │   │   ├── suppliers/
│   │   │   ├── purchase-orders/
│   │   │   ├── sales-orders/
│   │   │   ├── stock-transfers/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Sidebar, navigation
│   │   ├── products/       # Product-specific components
│   │   ├── suppliers/
│   │   ├── purchase-orders/
│   │   ├── warehouses/
│   │   └── providers/      # Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & configuration
│   │   ├── supabase/       # Supabase client setup
│   │   ├── hooks/          # Data-fetching hooks
│   │   ├── utils/          # Helper functions
│   │   └── validations/    # Zod schemas
│   └── types/              # TypeScript type definitions
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🔒 User Roles & Permissions

| Role | Products | Warehouses | Orders | Transfers | Reports | Users |
|------|----------|-----------|--------|-----------|---------|-------|
| **Admin** | Full CRUD | Full CRUD | Full CRUD | Full CRUD | View + Export | Manage |
| **Manager** | Full CRUD | View | Full CRUD | Full CRUD | View + Export | View |
| **Staff** | Create | View | Create + Update | Create + Update | View | — |
| **Viewer** | View | View | View | View | View | — |

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel domain (e.g. `https://medistock.vercel.app`)
4. Deploy!

> **Important:** After deploying, update your Supabase project:
> - Go to **Authentication** → **URL Configuration**
> - Set **Site URL** to your Vercel domain
> - Add your Vercel domain to **Redirect URLs**

### Deploy on Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

Set the same environment variables on your hosting platform. Ensure `NEXT_PUBLIC_SITE_URL` matches your deployed URL.

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) directory:

- [Quick Start Guide](./docs/QUICK_START.md)
- [Implementation Status](./docs/IMPLEMENTATION_STATUS.md)
- [RBAC Implementation](./docs/RBAC_IMPLEMENTATION.md)
- [Role Permissions (Detailed)](./docs/ROLE_PERMISSIONS_DETAILED.md)
- [Google Auth Setup](./docs/GOOGLE_AUTH_SETUP.md)
- [Sample Data](./docs/SAMPLE_DATA.md)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
