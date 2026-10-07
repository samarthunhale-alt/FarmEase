# 🌾 FarmEase – Farmer Marketplace

A full-stack farmer marketplace and agriculture management web application that connects farmers and buyers through a secure, role-based platform.

FarmEase allows farmers to create and manage product listings, buyers to discover and order agricultural products, and administrators to manage users, products, orders, reports, and platform operations from a centralized dashboard.

---

## 🔗 Live Links

| Resource | Link |
|----------|------|
| 🌐 Frontend | https://farm-ease-neon.vercel.app/ |
| ⚙️ Backend API | https://farmease-7m5z.onrender.com/ |
| 📦 GitHub Repository | https://github.com/samarthunhale-alt/FarmEase |
| ❤️ Backend Health Check | https://farmease-7m5z.onrender.com/ |

The backend provides a simple API health response to confirm that the deployed server is running.

---

## 📌 Project Overview

FarmEase is a full-stack web application designed to simplify the process of selling and purchasing agricultural products online.

The platform provides separate workflows for:

- 👨‍🌾 Farmers
- 🛒 Buyers
- 🛡️ Administrators

Farmers can list products with category, quantity, unit, price, location, description, availability, and optional images. Buyers can browse products through the marketplace and manage their shopping and orders. Administrators can manage users, products, reports, and platform-level operations.

The application uses a modern React frontend, Node.js/Express backend, MongoDB database, JWT authentication, protected routes, and cloud deployment.

---

## ✨ Key Features

### 👨‍🌾 Farmer Features

- Farmer registration and login
- Farmer dashboard
- Farmer profile management
- Add agricultural products
- Edit product listings
- Delete product listings
- Pause / resume product availability
- Product categories
- Quantity and unit management
- Product pricing
- Product location
- Product descriptions
- Optional product image uploads
- View personal listings
- Farmer order management
- Revenue and order statistics
- Weather information on dashboard

### 🛒 Buyer Features

- Buyer registration and login
- Buyer dashboard
- Browse agricultural products
- Product details
- Category-based product discovery
- Add products to cart
- Cart management
- Place orders
- View orders
- Buyer profile management

### 🛡️ Admin Features

- Admin dashboard
- User management
- Product management
- Product activation / disabling
- Order management
- Reports and analytics
- Platform statistics
- User status management
- Administrative controls

### 🌱 Agriculture Features

- Crop information
- Crop search
- Agricultural product categories
- Farmer location information
- Weather information
- Marketplace for farm products

### 🔐 Security Features

- JWT-based authentication
- Protected routes
- Role-based access control
- Secure password handling
- CORS protection
- Helmet security headers
- API rate limiting
- Environment variables for sensitive configuration
- Centralized API error handling

---

## 👥 User Roles

FarmEase supports three main application roles.

### 👨‍🌾 Farmer

Farmers can:

- Manage their profile
- Add and manage products
- Control product availability
- View orders
- Track revenue
- Access agricultural and weather information

### 🛒 Buyer

Buyers can:

- Browse the marketplace
- View product details
- Add products to cart
- Place orders
- Track their orders
- Manage their profile

### 🛡️ Admin

Administrators can:

- Manage users
- Manage products
- Manage orders
- View reports
- Monitor platform statistics
- Disable products when required

---

## 🔄 Main Application Workflow

```text
                    FarmEase
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Farmer        Buyer        Admin
          │            │            │
          ↓            ↓            ↓
   Create Product   Marketplace   Management
          │            │            │
          ↓            ↓            ↓
      Listing      Cart / Order   Reports
          │            │            │
          └────────────┼────────────┘
                       ↓
                  MongoDB Database
```

---

## 🏗️ System Architecture

```text
┌───────────────────────────────┐
│           Users               │
│   Farmer / Buyer / Admin      │
└───────────────┬───────────────┘
                │
                ↓
┌───────────────────────────────┐
│        React + Vite           │
│          Frontend             │
└───────────────┬───────────────┘
                │
                │ Axios / REST API
                ↓
┌───────────────────────────────┐
│      Node.js + Express        │
│           Backend             │
└───────────────┬───────────────┘
                │
                │ Mongoose
                ↓
┌───────────────────────────────┐
│        MongoDB Atlas          │
│           Database            │
└───────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript / JSX
- React Router
- Axios
- CSS / Tailwind utility classes
- React Context API
- Local Storage
- Responsive UI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Helmet
- CORS
- Morgan
- Express Rate Limit

### Database

- MongoDB Atlas

### Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

---

## 📁 Project Structure

```text
FarmEase/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── buyer/
│   │   │   └── farmer/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🌐 Frontend Routes

The application includes role-based routes such as:

```text
/
├── /about
├── /login
├── /register
├── /marketplace
├── /crop-info
│
├── /farmer
├── /farmer/listings
├── /farmer/listings/new
├── /farmer/listings/:id/edit
├── /farmer/profile
│
├── /buyer
├── /buyer/cart
├── /buyer/orders
├── /buyer/profile
│
├── /admin
├── /admin/products
├── /admin/reports
└── /admin/users
```

Protected routes ensure that users can access only the sections allowed for their role.

---

## 🔌 API Architecture

The backend exposes REST API endpoints under:

```text
https://farmease-7m5z.onrender.com/api
```

Major API modules include:

```text
/api/auth
/api/users
/api/farmers
/api/products
/api/crops
/api/categories
/api/crop-info
/api/orders
/api/weather
/api/uploads
/api/admin
```

Example endpoints:

```http
GET /api/products
GET /api/products/mine
GET /api/categories
GET /api/crop-info
GET /api/orders/mine
```

---

## 🔐 Environment Variables

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

### Backend (`server/.env`)

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

> ⚠️ Never commit `.env` files, database credentials, JWT secrets, or other production secrets to GitHub.

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/samarthunhale-alt/FarmEase.git
cd FarmEase
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### 3. Backend Setup

Open another terminal:

```bash
cd server
npm install
npm start
```

Backend runs at: http://localhost:5001

---

## ☁️ Deployment

FarmEase is deployed using:

```text
┌──────────────────────────┐
│          Vercel          │
│   React + Vite Frontend  │
└────────────┬─────────────┘
             │
             │ REST API
             ↓
┌──────────────────────────┐
│          Render          │
│  Node.js + Express API   │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│      MongoDB Atlas       │
│        Database          │
└──────────────────────────┘
```

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://farm-ease-neon.vercel.app/ |
| Backend | https://farmease-7m5z.onrender.com/ |

---

## 📊 Example Product Listing

A farmer can create a listing such as:

```text
Product       : Fresh Tomatoes
Category      : Vegetables
Quantity      : 100 kg
Price         : ₹40 / kg
Location      : Pune
Description   : Fresh farm-grown tomatoes
Availability  : Available
```

Product images are optional.

---

## 🧪 Testing

The application can be tested through the following workflows.

### Farmer

```text
Register/Login
      ↓
Farmer Dashboard
      ↓
Add Product
      ↓
My Listings
      ↓
Edit / Pause / Delete
      ↓
Manage Orders
```

### Buyer

```text
Register/Login
      ↓
Marketplace
      ↓
View Product
      ↓
Add to Cart
      ↓
Place Order
      ↓
View Orders
```

### Admin

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Manage Users
      ↓
Manage Products
      ↓
View Orders
      ↓
Reports & Analytics
```

---

## 🔒 Security Architecture

FarmEase follows common web application security practices:

```text
Authentication
      ↓
JWT Token
      ↓
Protected Routes
      ↓
Role-Based Authorization
      ↓
Validated API Requests
      ↓
MongoDB
```

Security measures include:

- JWT authentication
- Role-based authorization
- Password hashing
- Protected API routes
- CORS configuration
- Helmet security headers
- Rate limiting
- Environment-based secrets
- API error handling

---

## 🎯 Project Objectives

- Digitize agricultural product selling
- Connect farmers directly with buyers
- Simplify product listing and management
- Provide secure role-based access
- Reduce manual order management
- Provide a centralized marketplace
- Improve visibility of agricultural products
- Provide useful crop and weather information

---

## 🚧 Future Enhancements

- Online payment integration
- Advanced product search and filters
- Product reviews and ratings
- Order tracking
- Farmer-buyer messaging
- Push notifications
- Advanced analytics dashboards
- Multi-language support
- Mobile application
- AI-based crop recommendations

---

## 👨‍💻 Developer

**Samarth Unhale**
Computer Engineering Student & Full-Stack Developer

- GitHub: https://github.com/samarthunhale-alt
- Project Repository: https://github.com/samarthunhale-alt/FarmEase

---

## ⭐ Project Highlights

- Full-stack MERN-style architecture
- Role-based authentication and authorization
- Farmer, Buyer and Admin workflows
- RESTful backend APIs
- MongoDB Atlas database
- Responsive React interface
- Cloud deployment using Vercel and Render
- Secure API configuration
- Real-world agriculture marketplace use case

---

## 📄 License

This project is developed for educational, portfolio, and demonstration purposes.