const Order = require('../models/order');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { 
            user, 
            items, 
            totalPrice, 
            shippingAddress, 
            phone, 
            paymentMethod, 
            customerName 
        } = req.body;

        // Validation
        if (!user || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: 'Missing required fields: user, items' 
            });
        }

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        
        const shipping = 10;
        const discount = 0;
        const total = subtotal + shipping - discount;

        // Create order
        const order = new Order({
            customer: customerName || user.split('@')[0] || 'Guest',
            email: user,
            phone: phone || 'Not provided',
            products: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image || ''
            })),
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: total,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            shippingAddress: shippingAddress || 'Not provided',
            status: 'Pending'
        });

        const savedOrder = await order.save();
        
        console.log(` New order created in MongoDB: ${savedOrder.orderId} for ${savedOrder.customer}`);

        res.status(201).json({ 
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ 
            error: error.message || 'Failed to create order'
        });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const { status, date, customer } = req.query;
        
        let filter = {};
        
        if (status) filter.status = status;
        
        if (customer) {
            filter.$or = [
                { customer: { $regex: customer, $options: 'i' } },
                { email: { $regex: customer, $options: 'i' } }
            ];
        }
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            filter.createdAt = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        
        res.json({ 
            success: true,
            count: orders.length,
            orders: orders 
        });

    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve orders'
        });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        
        if (!order) {
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }
        
        res.json({ 
            success: true,
            order 
        });

    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve order'
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { 
                status: status,
                updatedAt: Date.now()
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }
        
        console.log(` Order ${req.params.id} status updated to: ${status}`);
        
        res.json({ 
            success: true,
            message: 'Order status updated',
            order: order
        });

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to update order'
        });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.id });
        
        if (!order) {
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }
        
        console.log(` Order ${req.params.id} deleted from MongoDB`);
        
        res.json({ 
            success: true,
            message: 'Order deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to delete order'
        });
    }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
    try {
        const orders = await Order.find();
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Today's orders
        const todayOrders = await Order.find({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        });

        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'Pending').length,
            processing: orders.filter(o => o.status === 'Processing').length,
            shipped: orders.filter(o => o.status === 'Shipped').length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            cancelled: orders.filter(o => o.status === 'Cancelled').length,
            totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
            todayOrders: todayOrders.length,
            todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0)
        };
        
        res.json({ 
            success: true,
            stats 
        });

    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to retrieve statistics'
        });
    }
};