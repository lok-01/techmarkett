# Tech Market 🛒

Welcome to **Tech Market**, a modern e-commerce web application designed to provide a seamless shopping experience for tech enthusiasts! This application allows users to browse products, manage their shopping carts, save favorites to a wishlist, and easily navigate through a clean, responsive layout.

##  Features
- **Modern UI**: Responsive and clean React interface built with Vite.
- **Cart & Wishlist**: Slide-out sidebars for an intuitive shopping experience.
- **Product Management**: Node.js backend with MVC architecture for handling product data dynamically.
- **Quick Navigation**: Fully functional Home, Shop, About, and Contact pages.

##  Tech Stack
- **Frontend**: React, Vite, CSS, React Context API
- **Backend**: Node.js, Express, MongoDB (via Mongoose)

---

Live urls : 
frontend : https://techmarkett.vercel.app/
backend products : get request / :  https://techmarkett.onrender.com/api/products


## Project Structure

This project is separated into a frontend Client and a backend API:

### Frontend Layout
The interactive React application responsible for the user interface.
```text
frontend/
├── src/
│   ├── assets/         # Images, icons, and static assets
│   ├── Components/     # Reusable UI pieces (ProductCard, Navbar, CartSidebar, etc.)
│   ├── context/        # Global state management layer (UserProvider)
│   ├── Pages/          # Main application views (Home, Shop, About, Contact)
│   ├── App.jsx         # Main application layout, components configuration
│   ├── main.jsx        # React entry point
│   ├── data.js         # Local frontend seed/mock data
│   └── index.css       # Global styling
```

### Backend Layout
The Node.js Express server handling business logic and database connections.
```text
backend/
├── config/             # Database connection and environment variables
├── controller/         # Logic for handling API requests (product.controller.js)
├── middleware/         # Custom Express middlewares
├── model/              # Database schemas (product.model.js)
├── route/              # API endpoint definitions (product.route.js)
├── main.js             # Express server entry point
└── seed.js             # Script to populate database with initial products
```

---

## 🔌 API Reference

The backend uses RESTful architecture. All product-related API routes start with the base URL: `/api/products`

### 1. Get All Products
Retrieves a list of all tech products available in the store.
- **URL**: `/api/products`
- **Method**: `GET`
- **Success Response Data**: A JSON array of product objects.

### 2. Create a Product
Adds a new product to the database catalog.
- **URL**: `/api/products`
- **Method**: `POST`
- **Body JSON Format Example**:
  ```json
  {
    "name": "Wireless Headphones",
    "price": 99.99,
    "description": "Noise-cancelling wireless headphones.",
    "category": "Electronics"
  }
  ```

---

## ⚙️ How to Run Locally

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed before running the project.

### 2. Start the Backend Server
Open your terminal and run the following configuration:
```bash
cd backend
npm install
npm start  # Runs node main.js
```

### 3. Start the Frontend App
Open a **new** terminal window (leave the backend running) and type:
```bash
cd frontend
npm install
npm run dev
```

Click the local link (usually `http://localhost:5173`) provided in your terminal to open the Tech Market in your web browser!
