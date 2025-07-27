import express from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;

// CORS configuration for production
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.ADMIN_URL || 'http://localhost:5174',
        'https://foodiee-frontend.vercel.app', // Your Vercel frontend domain
        'https://foodiee-admin.vercel.app'     // Your Vercel admin domain
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

// middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors(corsOptions))

// Static file serving
app.use("/images", express.static('uploads'))

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Food Delivery API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Root endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "🍅 Tomato Food Delivery API", 
        version: "1.0.0",
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            health: "/health",
            users: "/api/user",
            food: "/api/food",
            cart: "/api/cart",
            orders: "/api/order"
        }
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "Route not found" 
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("❌ Server Error:", error);
    res.status(500).json({ 
        success: false, 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`🚀 Server started on port ${port}`);
            console.log(`📊 Health check: http://localhost:${port}/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
