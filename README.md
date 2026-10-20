# Restaurant Menu & Table Order System

A full-stack web application for restaurant digital dining, featuring customer menu browsing, table selection, order placement, server-side GST billing, customer order management, staff order workflow coordination, and admin analytics dashboard.

---

## Live Deployment

- **Frontend**: [Restaurant Menu & Table Order System](https://assignment-6-pearl-zeta.vercel.app/)
- **Backend API**: [Render Backend](https://assignment-6-2o1t.onrender.com/)
- **Health Check**: [Backend Health](https://assignment-6-2o1t.onrender.com/api/health)

---

## Features

### Customer Experience
- **Menu Browsing & Search**: Real-time menu fetched from MongoDB with category filtering (Starters, Main Course, Beverages, Desserts), veg-only filter, and live text search.
- **Cart Management**: Persistent cart backed by `localStorage` with quantity adjustments and availability validation.
- **Table Selection**: Dynamic table selection displaying seating capacity and real-time status (Available, Occupied, Reserved). Unavailable tables are disabled.
- **Order Placement**: Authenticated order placement with automatic table occupancy coordination.
- **Server-Side Billing**: Subtotal, 5% GST, and grand total calculations enforced strictly on the backend to prevent client-side tampering.
- **Order History & Receipts**: Dedicated `/my-orders` page displaying logged-in customer's orders and itemized digital receipts at `/orders/:id`.
- **Order Cancellation**: Customers can cancel orders strictly while in `Placed` status, automatically releasing the table back to `Available`.

### Staff & Kitchen Workflow
- **Order Status Management**: Staff and admins can manage live kitchen status across valid sequential stages: `Placed` → `Preparing` → `Served` → `Paid`.
- **Table Release**: Marking an order as `Paid` automatically releases the associated dining table back to `Available`.

### Admin Management & Analytics
- **Menu Item Management**: Full CRUD operations for menu dishes (`/admin/menu`, `/admin/menu/new`, `/admin/menu/:id/edit`), including availability toggles, price updates, and categories.
- **Table Management**: Full CRUD for restaurant dining tables (`/admin/tables`) with safety checks preventing deletion or availability overrides while active orders exist.
- **Dashboard Analytics**: Operational insights (`/admin/dashboard`) including today's order count, settled revenue (completed Paid orders only), seated tables count, top 5 selling items, and category-wise sales volume.

---

## Tech Stack

- **Frontend**: React 19, React Router 7, Vite, Vanilla CSS
- **Backend**: Node.js, Express 5, MongoDB Atlas, Mongoose 9
- **Authentication**: JSON Web Tokens (JWT), bcryptjs password hashing
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## Project Structure

```
assignment-6/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── tableController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── RestaurantTable.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── tableRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Cart.jsx
│   │   │   ├── MenuFilter.jsx
│   │   │   ├── MenuItemCard.jsx
│   │   │   ├── MenuItemForm.jsx
│   │   │   ├── MenuSearch.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderConfirmationModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TableSelector.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminMenuEditPage.jsx
│   │   │   ├── AdminMenuNewPage.jsx
│   │   │   ├── AdminMenuPage.jsx
│   │   │   ├── AdminOrdersPage.jsx
│   │   │   ├── AdminTablesPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyOrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Get authenticated user profile

### Menu Items
- `GET /api/menu` — Retrieve menu items (optional `?category=`)
- `GET /api/menu/:id` — Get single menu item details
- `POST /api/menu` — Create a menu item (Admin only)
- `PUT /api/menu/:id` — Update a menu item (Admin only)
- `PATCH /api/menu/:id/toggle` — Toggle item availability (Admin only)
- `DELETE /api/menu/:id` — Delete a menu item (Admin only)

### Dining Tables
- `GET /api/tables` — List all dining tables
- `GET /api/tables/:id` — Get single table details
- `POST /api/tables` — Create a table (Admin only)
- `PUT /api/tables/:id` — Update table capacity or status (Admin only)
- `DELETE /api/tables/:id` — Delete a table (Admin only; blocked if active orders exist)

### Orders & Billing
- `POST /api/orders` — Place order with server-calculated subtotal, 5% GST, and total
- `GET /api/orders/my-orders` — List logged-in customer's orders
- `GET /api/orders/:id` — View order details & itemized receipt
- `PATCH /api/orders/:id/cancel` — Cancel order (Customer own order; only if `Placed`)
- `GET /api/orders` — List all orders with filters (Staff/Admin only)
- `PATCH /api/orders/:id/status` — Advance order status (Staff/Admin only)

### Dashboard
- `GET /api/dashboard/stats` — Live sales metrics & aggregations (Staff/Admin only)

### System
- `GET /api/health` — Backend and database connectivity status

---

## Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/shxvaamm/Assignment-6.git
cd Assignment-6
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create `backend/.env` with:
```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5174
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create `frontend/.env` with:
```env
VITE_API_URL=http://localhost:5002
```
Start the frontend development server:
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.
