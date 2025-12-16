##Tuckshop Inventory and POS System##
This repository contains the frontend and backend components for a simple Point-of-Sale (POS) and inventory management system designed for a small tuckshop or canteen.

Current Status
This is a work in progress. The application currently features the core UI for stock oversight and sales processing.

Key Features Implemented
Dashboard: Provides a summary of Key Performance Indicators (KPIs) including total revenue, transaction counts, total inventory value, and low stock alerts. This data is fetched live from the database.

Point-of-Sale (POS) Terminal: A dedicated interface for staff to quickly process customer sales. Includes functionality for category filtering and searching products by name or SKU to speed up checkout.

Product Listing: A page to view all available products.

Basic Stock Movement History: A log is available on the Admin page to show changes in stock levels. Note: Full integration and functionality for manual adjustments are still pending.

Known Limitations
The following features are currently being developed and may not function fully or correctly:

Sales Processing (Backend): While the POS UI allows adding items to the cart, the final checkout process (generating a sales record and permanently deducting stock from the database) may not be fully implemented or tested yet.

Stock Movement/History: The history table is present, but manual stock adjustments (restocking, logging wastage) are not yet possible via the application interface. All stock changes rely solely on successful POS transactions.

Authentication/User Management: User logins, roles, and permissions are not yet implemented. The application is currently accessible without a sign-in process.

Getting Started
To run the application, ensure both the frontend (Tuckshop Client) and the corresponding backend (Tuckshop Server) services are running and correctly configured to connect to your database.

Prerequisites: Node.js, npm, and a PostgreSQL database instance.

Configuration: Update the API base URL in tuckshop_client/src/api/config.ts to point to your running backend server (e.g., http://localhost:3001/api).

Installation: Run npm install in both the client and server directories.

Running: Start the backend server first, then the client application.

Next Steps (Development Focus)
The immediate next steps in development should focus on stabilizing the core functionality:

Completing the backend logic for processing sales and stock deductions.

Implementing forms for manual stock adjustments (restocks and wastage).

Adding CRUD operations for product and category management.
