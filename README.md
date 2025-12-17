"# TuckShop

A modern point-of-sale (POS) and inventory management system designed for small convenience stores and tuck shops. Built with React, TypeScript, Express, and PostgreSQL.

## Features

### Core Functionality
- **Point of Sale (POS)**: Quick checkout system for processing sales
- **Inventory Management**: Track products with real-time stock levels
- **Category Management**: Organize products by categories
- **Stock Movement Tracking**: Complete audit trail of all inventory changes
- **Dashboard Analytics**: Real-time business metrics and insights

### Advanced Features
- **Refund & Return System**: Reversible operations instead of deletions
- **Stock Validation**: Prevents negative stock levels across all operations
- **Date Filtering**: Filter stock movements by date range
- **PDF Reports**: Export data from inventory, stock movements, and dashboard
- **Low Stock Alerts**: Automatic notifications when items fall below safety levels
- **Audit Trail**: Product names preserved even after deletion

## Tech Stack

### Frontend
- React 19 with TypeScript
- Material-UI (MUI) v7
- Vite for build tooling
- jsPDF for PDF generation

### Backend
- Node.js with Express
- TypeScript
- Knex.js for database migrations and queries
- PostgreSQL database

## Project Structure

```
TuckShop/
├── server/                    # Backend application
│   ├── src/
│   │   ├── handlers/         # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── index.ts          # Server entry point
│   │   └── knex.ts           # Database configuration
│   ├── migrations/           # Database migrations
│   └── seeds/                # Initial data
└── tuckshop_client/          # Frontend application
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/            # Main application pages
        ├── api/              # API service layer
        └── types/            # TypeScript definitions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TuckShop
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=tuckshop
   PORT=5000
   ```

   Run migrations:
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

3. **Setup Frontend**
   ```bash
   cd ../tuckshop_client
   npm install
   ```

### Running the Application

1. **Start the backend server** (from `server` directory):
   ```bash
   npm run start
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend** (from `tuckshop_client` directory):
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

## Usage Guide

### Dashboard
View key business metrics including:
- Daily revenue and transaction count
- Refunds processed today
- Total inventory value
- Active categories
- Low stock alerts
- Most popular items (last 30 days)

### Point of Sale (POS)
1. Select products from the catalog
2. Adjust quantities as needed
3. Process sale with automatic stock deduction
4. Generate refunds for returned items

### Inventory Management
- Add, edit products
- View current stock levels
- Export inventory reports to PDF
- Monitor product categories

### Admin Panel
- **Categories**: Create and manage product categories
- **Stock Movements**: View complete history of all stock changes
  - Filter by date range
  - Track SALE, PURCHASE, REFUND, RETURN, ADJUSTMENT types
  - Export to PDF for reporting

## Stock Movement Types

- **SALE**: Deducts stock when items are sold
- **PURCHASE**: Adds stock when inventory is received
- **REFUND**: Reverses a SALE (adds stock back)
- **RETURN**: Reverses a PURCHASE (removes stock)
- **ADJUSTMENT**: Manual corrections (positive or negative)

## Key Design Decisions

1. **No Hard Deletes**: Products can't be permanently deleted; audit trail is preserved
2. **Reversible Operations**: Refunds and returns instead of delete operations
3. **Stock Validation**: Database and application-level checks prevent negative stock
4. **Audit Trail**: Product names stored in stock movements survive product deletion

## Database Schema

Key tables:
- `categories`: Product categories
- `products`: Product catalog with pricing and stock levels
- `sales`: Transaction records
- `sale_items`: Individual items in each sale
- `stockmovements`: Complete audit trail of inventory changes

## Development Notes

- TypeScript strict mode enabled
- ESLint configured for code quality
- No use of `any` type or `innerHTML`
- Material-UI custom theme applied
- Responsive design for mobile and desktop


