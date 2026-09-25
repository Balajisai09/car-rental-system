# GoDrive - Full Stack Car Rental Application

A modern, full-stack car rental platform built with **React 18 + Vite** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

---

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based registration and login, password hashing with bcryptjs, protected routes, and admin roles.
- **Car Catalog & Management**: Search and filter cars dynamically by Category (SUV, Sedan, Luxury, Hatchback), Seats (4, 5, 7), Transmission (Automatic, Manual), Fuel Type (Petrol, Diesel, CNG, Electric), and Price range.
- **Detailed Specifications & Reviews**: In-depth engine specs, safety features, ratings, and customer reviews stored in MongoDB.
- **Reservation & Booking Engine**: Real-time duration calculation, dynamic daily pricing, optional Full Protection insurance (+₹499/day), and booking persistence.
- **My Bookings Dashboard**: Track upcoming, completed, and cancelled rentals with live booking cancellation.
- **User Profile**: Edit personal info (Name, Email, Phone, Location), track total booking stats.
- **Promotions & Offers**: View exclusive coupons (e.g. `FIRST500`, `HDFC10`, `WEEKEND15`) with one-click copy.
- **Customer Care & Inquiries**: Contact message form saving directly to the database.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Lucide Icons, Redux, Vanilla CSS
- **Backend**: Node.js (ES Modules), Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (JSON Web Tokens), bcryptjs password hashing, CORS

---

## 📁 Project Structure

```
CAR-RENTALS/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # UI pages & components
│   │   │   ├── Login.jsx        # Login page connected to API
│   │   │   ├── Register.jsx     # Registration page connected to API
│   │   │   ├── Home.jsx         # Landing page + fleet + contact form
│   │   │   ├── CarsList.jsx     # Live filtering car list
│   │   │   ├── CarDetails.jsx   # Vehicle specs & reviews
│   │   │   ├── Booking.jsx      # Reservation checkout
│   │   │   ├── MyBookings.jsx   # Live user bookings & cancellation
│   │   │   ├── Profile.jsx      # Profile management & stats
│   │   │   └── Offers.jsx       # Deals & coupons
│   │   ├── services/
│   │   │   └── api.js           # Centralized API service with JWT auth
│   │   └── vite.config.js       # Configured with proxy to port 5050
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Register, login, profile
│   │   ├── carController.js     # Get cars, single car, reviews
│   │   ├── bookingController.js # Create booking, my-bookings, cancel
│   │   ├── offerController.js   # Offers list & coupon validation
│   │   └── contactController.js # Contact inquiries
│   ├── models/                  # Mongoose Schemas
│   │   ├── User.js
│   │   ├── Car.js
│   │   ├── Booking.js
│   │   ├── Offer.js
│   │   └── Contact.js
│   ├── routes/                  # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── offerRoutes.js
│   │   └── contactRoutes.js
│   ├── seeder.js                # Initial database seeder (13 cars, reviews, demo users, offers)
│   ├── server.js                # Express app entrypoint
│   └── .env                     # Server environment variables
└── package.json                 # Monorepo root scripts
```

---

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (either installed locally or free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)

### 2. Configure MongoDB in `server/.env`

Open [server/.env](file:///c:/SWSetup/Pictures/Camera%20Roll/Desktop/CAR/CAR-RENTALS/server/.env):
```env
PORT=5050
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/car-rental
JWT_SECRET=godrive_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=30d
```

> **Using MongoDB Atlas?**
> Replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/car-rental?retryWrites=true&w=majority`

### 3. Seed Database (Optional - Happens Automatically on 1st Run)

To populate the database with default cars, demo users, offers, and sample bookings:
```bash
npm run seed
```

Default demo accounts created by the seeder:
- **User**: `john.doe@example.com` / `password123`
- **Admin**: `admin@godrive.com` / `password123`

### 4. Running the Application

You can start the backend and frontend separately or simultaneously:

**Terminal 1 (Backend):**
```bash
npm run server
```
*Backend runs on `http://localhost:5050`*

**Terminal 2 (Frontend):**
```bash
npm run client
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & get JWT | No |
| `GET` | `/api/auth/profile` | Get current user profile + booking stats | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `GET` | `/api/cars` | Fetch cars (supports query filters) | No |
| `GET` | `/api/cars/:id` | Fetch single car details & reviews | No |
| `POST` | `/api/cars/:id/reviews` | Submit a review for a car | Yes |
| `POST` | `/api/bookings` | Create a new car reservation | Yes |
| `GET` | `/api/bookings/my-bookings` | Get logged-in user's bookings | Yes |
| `PUT` | `/api/bookings/:id/cancel` | Cancel an active booking | Yes |
| `GET` | `/api/offers` | Fetch active promotional offers | No |
| `POST` | `/api/offers/validate` | Validate coupon discount code | No |
| `POST` | `/api/contact` | Submit customer support inquiry | No |
| `GET` | `/api/health` | Check API & database connection status | No |
