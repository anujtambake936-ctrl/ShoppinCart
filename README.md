# 🛒 E-Commerce Shopping Cart - MERN Stack

A production-ready full-stack e-commerce application built with the MERN stack, featuring secure authentication, payment processing, and optimized performance for scalability.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

### User Features
- 🔐 Secure user authentication (JWT + bcrypt)
- 🛍️ Browse products with category filtering
- 🛒 Real-time shopping cart management
- 💳 Secure payment processing via Stripe
- 📦 Order history tracking
- 🔍 Product search and filtering

### Admin Features
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 👥 Role-based access control

### Technical Features
- ⚡ Optimized database queries with pagination
- 🔒 Rate limiting for API protection
- 📊 Database indexing for fast queries
- 🗜️ Response compression
- 🔄 Connection pooling
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Stripe** - Payment processing
- **express-rate-limit** - API protection
- **compression** - Response optimization

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
shopping-cart-mern/
├── client/                  # React frontend
│   ├── src/
│   │   ├── app/            # Redux store & slices
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── helpers/        # Utility functions
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Auth & validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── package.json
│
└── DEPLOYMENT-OPTIMIZATIONS.md  # Performance guide
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shopping-cart-mern.git
cd shopping-cart-mern
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_KEY=your_stripe_secret_key
ORIGIN=http://localhost:5173
NODE_ENV=development
```

5. **Run the application**

Backend (from `server/` directory):
```bash
npm run dev
```

Frontend (from `client/` directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Products
- `GET /api/products?page=1&limit=20&category=Electronics` - Get paginated products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories` - Get all categories

### Cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `PUT /api/cart/increment/:id` - Increase quantity
- `PUT /api/cart/decrement/:id` - Decrease quantity
- `POST /api/cart/checkout` - Create Stripe session
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders?page=1&limit=10&status=completed` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies for token storage
- CORS configuration
- Rate limiting:
  - General API: 100 requests/15 min
  - Auth routes: 10 requests/15 min
  - Checkout: 20 requests/15 min
- Input validation
- Role-based access control

## ⚡ Performance Optimizations

- Database indexes on frequently queried fields
- Connection pooling (max: 10, min: 2)
- Query optimization with `.lean()` and `.select()`
- Pagination for large datasets
- Response compression (gzip/brotli)
- Selective field projection
- 90% query latency reduction

See [DEPLOYMENT-OPTIMIZATIONS.md](./DEPLOYMENT-OPTIMIZATIONS.md) for detailed performance metrics.


## 🎨 UI Features

- Responsive design for mobile, tablet, and desktop
- Skeleton loading states
- Toast notifications
- Product image galleries
- Category filters
- Search functionality
- Shopping cart sidebar
- Order history with status badges

## 🧪 Testing

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables
2. Set `NODE_ENV=production`
3. Deploy from `server/` directory

### Frontend (Vercel/Netlify)
1. Update API base URL in frontend
2. Deploy from `client/` directory

### Database (MongoDB Atlas)
1. Create cluster
2. Whitelist IP addresses
3. Update `MONGO_URI` in environment variables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Anuj Tambake**



⭐ **Star this repository if you find it helpful!**
