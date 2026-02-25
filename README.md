# ParfumStore

A modern e-commerce platform for perfume shopping with a complete admin dashboard for product and order management.

## Features

### User Features
- Browse perfume products with beautiful UI
- Shopping cart with real-time updates
- User authentication (Sign In / Sign Up)
- Order placement and tracking
- Fully responsive design

### Admin Features
- Add new products with details (name, price, description, image, stock, status)
- Edit existing products
- Delete products from inventory
- View and manage orders
- Order status management (Pending/Done)
- Product inventory tracking

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite 7.3.1** - Build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icon library

### Backend
- **Node.js** with **Express 5.2.1** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd PS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
DB_USER=your_database_user
DB_HOST=localhost
DB_DATABASE=parfumstore
DB_PASSWORD=your_database_password
DB_PORT=5432
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE parfumstore;
\q
```

The database tables will be created automatically when you start the backend server.

## Running the Project

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Project Structure

```

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authControllers.ts
│   │   │   └── productControllers.ts
│   │   ├── database/
│   │   │   ├── createDb.ts
│   │   │   ├── db.ts
│   │   │   └── recreateTables.ts
│   │   ├── middleware/
│   │   │   ├── admin.ts
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── product.ts
│   │   │   └── user.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── ProductRoutes.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── dashboard/
│   │   │   └── component/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AuthModal.tsx
│   │   │       ├── Cart.tsx
│   │   │       └── Dashboard.tsx
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

## Database Schema

### Products Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- price (DECIMAL)
- description (TEXT)
- image (VARCHAR)
- stock (INTEGER)
- status (VARCHAR) - available/sold out/coming soon
- created_at (TIMESTAMP)
```

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- created_at (TIMESTAMP)
```

### Orders Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER)
- total (DECIMAL)
- status (VARCHAR)
- created_at (TIMESTAMP)
```

### Cart Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER)
- product_id (INTEGER)
- quantity (INTEGER)
- created_at (TIMESTAMP)
```

## Key Features Implementation

### Admin Dashboard
- Complete CRUD operations for products
- Order management with status updates
- Real-time product inventory tracking
- Clean and modern dark-themed UI

### Shopping Cart
- Add/remove items
- Update quantities
- Animated sidebar
- Real-time price calculations

### Authentication
- Modal-based login/signup
- Form validation
- Secure password handling

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run start
```

## Environment Variables

### Backend (.env)
```env
DB_USER=your_database_user
DB_HOST=localhost
DB_DATABASE=parfumstore
DB_PASSWORD=your_database_password
DB_PORT=5432
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Your Name

## Acknowledgments

- Tailwind CSS for the amazing utility-first CSS framework
- Lucide React for beautiful icons
- PostgreSQL for reliable database management
