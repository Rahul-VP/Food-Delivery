import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config variables
const currency = "inr";
const deliveryCharge = 5; // $5 delivery charge
const frontend_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Input validation helper
const validateOrderData = (data) => {
    const errors = [];
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        errors.push("Order must contain at least one item");
    }
    
    if (!data.amount || data.amount <= 0) {
        errors.push("Invalid order amount");
    }
    
    if (!data.address) {
        errors.push("Delivery address is required");
    }
    
    return errors;
};

// Placing User Order for Frontend
const placeOrder = async (req, res) => {
    try {
        // Validate input data
        const validationErrors = validateOrderData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }

        // Check if user exists
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "pending",
            payment: false
        });

        await newOrder.save();
        
        // Clear user's cart after successful order creation
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare Stripe line items
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
              product_data: {
                    name: item.name,
                    description: item.description || item.name
              },
                unit_amount: Math.round(item.price * 100 * 80) // Convert to cents and INR
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: Math.round(deliveryCharge * 100 * 80)
            },
            quantity: 1
        });

        // Create Stripe checkout session
          const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                orderId: newOrder._id.toString()
            }
          });
      
        res.json({ 
            success: true, 
            session_url: session.url,
            orderId: newOrder._id 
        });

    } catch (error) {
        console.error("❌ Place Order Error:", error);
        
        if (error.type === 'StripeCardError') {
            return res.status(400).json({ 
                success: false, 
                message: "Payment failed: " + error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Failed to place order. Please try again." 
        });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        const orders = await orderModel.find(filter)
            .populate('userId', 'name email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const total = await orderModel.countDocuments(filter);
        
        res.json({ 
            success: true, 
            data: orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("❌ List Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch orders" 
        });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }
        
        const orders = await orderModel.find({ userId: req.body.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
            
        res.json({ 
            success: true, 
            data: orders,
            totalOrders: orders.length
        });
    } catch (error) {
        console.error("❌ User Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch user orders" 
        });
    }
};

// Update order status (Admin only)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID and status are required" 
            });
        }
        
        const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status. Must be one of: " + validStatuses.join(', ') 
            });
        }
        
        const order = await orderModel.findByIdAndUpdate(
            orderId, 
            { status: status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        res.json({ 
            success: true, 
            message: "Order status updated successfully",
            order: order
        });
    } catch (error) {
        console.error("❌ Update Status Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update order status" 
        });
    }
};

// Verify payment and update order
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID is required" 
            });
        }
        
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(
                orderId, 
                { 
                    payment: true, 
                    status: 'confirmed',
                    paymentDate: new Date()
                },
                { new: true }
            );
            
            if (!order) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Order not found" 
                });
            }
            
            res.json({ 
                success: true, 
                message: "Payment verified successfully",
                order: order
            });
        } else {
            // Delete order if payment failed
            const deletedOrder = await orderModel.findByIdAndDelete(orderId);
            
            if (!deletedOrder) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Order not found" 
                });
            }
            
            res.json({ 
                success: false, 
                message: "Payment failed. Order cancelled." 
            });
        }
    } catch (error) {
        console.error("❌ Verify Order Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to verify order" 
        });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus ,verifyOrder }
