# Food-Delivery

A full-featured food delivery application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB Atlas account
- Stripe account (for payments)


3
This will start:
- Backend server on `http://localhost:4000`
- Frontend on `http://localhost:5173`

## 📁 Project Structure

```
Food-Delivery/
├── backend/          # Node.js/Express API
├── frontend/         # React client application
├── setup.js         # Database setup script
└── package.json     # Root package.json
```

### Root Level
- `npm run dev` - Start all services in development mode
- `npm run build` - Build frontend and admin for production
- `npm run install-all` - Install dependencies for all services
- `npm run setup` - Run database setup script

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Rate limiting (can be added)


## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Stripe API
- Multer (file uploads)

**Happy Coding! 🎉**
