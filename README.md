# Tech Market

A **full-stack MERN e-commerce application** with JWT authentication, role-based access control (RBAC), and an admin dashboard. Built with React, Node.js, Express, and MongoDB.

---

## Live URLs

- **Frontend**: [https://techmarkett.vercel.app](https://techmarkett.vercel.app/)
- **Backend API**: [https://techmarkett.onrender.com/api/products](https://techmarkett.onrender.com/api/products)

## Features

### Customer Features
- **Product Browsing** — Browse, search, filter by brand, and sort products
- **Cart & Wishlist** — Slide-out sidebars with quantity management & localStorage persistence
- **Dark/Light Mode** — Theme toggle across the entire application
- **Responsive Design** — Works on desktop, tablet, and mobile

### Authentication
- **Signup** — User registration with bcrypt password hashing
- **Login** — JWT token-based authentication (1-hour expiry)
- **Persistent Sessions** — Token stored in localStorage, survives page refresh
- **Role-Based Access** — Admin and User roles with different permissions

### Admin Dashboard
- **Product Management** — Full CRUD (Create, Read, Update, Delete) for products
- **User Management** — View all registered users with roles and join dates
- **Protected Routes** — Backend middleware blocks unauthorized access (401/403)

## Role-Based Access Control

| Action | Public | User | Admin |
|--------|--------|------|-------|
| View products | Yes | Yes | Yes |
| Signup / Login | Yes | Yes | Yes |
| Add to cart / wishlist | Yes | Yes | Yes |
| Create product | No | No | Yes |
| Update product | No | No | Yes |
| Delete product | No | No | Yes |
| View all users | No | No | Yes |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router, Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken) + bcrypt |
| **Styling** | Vanilla CSS (dark/light mode support) |

---

## Project Structure

### Frontend
```
frontend/src/
├── context/
│   ├── Createcontext.jsx       # React createContext()
│   └── UserProvider.jsx        # Auth state (user, token, login, signup, logout)
├── Pages/
│   ├── Home.jsx                # Landing page with hero section
│   ├── Shop.jsx                # Product listing with filters
│   ├── About.jsx               # About page
│   ├── Contact.jsx             # Contact page
│   ├── Login.jsx               # Login form
│   ├── Signup.jsx              # Registration form
│   └── AdminDashboard.jsx      # Admin panel (products CRUD + users table)
├── Components/
│   ├── MyNavbar.jsx            # Dynamic navbar (Login/Logout/Dashboard by role)
│   ├── Productcard.jsx         # Product display card
│   ├── ProductsSection.jsx     # Products grid with search/filter/sort
│   ├── CartSidebar.jsx         # Slide-out cart
│   ├── WishlistSidebar.jsx     # Slide-out wishlist
│   ├── Hero.jsx                # Hero section
│   └── Footer.jsx              # Footer
├── App.jsx                     # Routes + global state
├── App.css                     # All styles (dark + light mode)
└── main.jsx                    # Entry point with BrowserRouter + UserProvider
```

### Backend
```
backend/
├── config/
│   └── config.js               # MongoDB connection + env variables
├── controller/
│   ├── user.controller.js      # signup (bcrypt hash), login (JWT sign), getAllUsers
│   └── product.controller.js   # create, getAll, update, delete products
├── middleware/
│   └── auth.middleware.js      # verifyToken (JWT verify) + isAdmin (role check)
├── model/
│   ├── user.model.js           # User schema (username, email, password, role)
│   └── product.model.js        # Product schema (name, brand, price, image, etc.)
├── route/
│   ├── user.route.js           # /api/auth/* — signup, login, get users
│   └── product.route.js        # /api/products/* — CRUD with middleware protection
├── main.js                     # Express server entry point
├── seed.js                     # Seed products + admin user into database
└── .env                        # MONGO_URI, PORT, JWT_SECRET
```

---

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/users` | Admin only | Get all registered users |

### Product Routes (`/api/products`)

| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| GET | `/api/products` | Public | Get all products |
| POST | `/api/products` | Admin only | Create a new product |
| PUT | `/api/products/:id` | Admin only | Update a product |
| DELETE | `/api/products/:id` | Admin only | Delete a product |

Protected routes require `Authorization: Bearer <token>` header. Admin routes also require `role: "admin"` in the JWT payload.

---

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/techmarket.git
cd techmarket
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Seed the database with products and an admin user:
```bash
node seed.js
```

Start the backend server:
```bash
npm start
```

### 3. Setup Frontend
Open a **new terminal** (keep backend running):
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Default Admin Credentials
```
Email:    admin@gmail.com
Password: admin123
```

---

## How Authentication Works

```
1. User signs up     -> Password hashed with bcrypt -> Saved in MongoDB
2. User logs in      -> bcrypt.compare verifies password
                     -> JWT token created with { id, role }
                     -> Token sent to frontend

3. Frontend stores   -> user object + token in React state + localStorage
                     -> Context API shares auth state with all components

4. Protected API call -> Frontend sends token in Authorization header
                      -> Backend middleware verifies token signature
                      -> Middleware checks role (admin/user)
                      -> Controller runs if authorized
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
