const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// File paths 
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');


// Middleware
app.use(cors());
app.use(express.json());

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/deluxperfumes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB Connected Successfully');
  } catch (error) {
    console.error(' MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Call the connectDB function
connectDB();

// ============================================
// HELPER FUNCTIONS (for orders only)
// ============================================
function readOrders() {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing orders:', error);
    return false;
  }
}

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `#${timestamp}${random}`.slice(0, 10);
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'DELUX PERFUMES API Server', 
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      'POST /orders': 'Create new order',
      'GET /orders': 'Get all orders',
      'GET /orders/:id': 'Get order by ID',
      'PUT /orders/:id/status': 'Update order status',
      'DELETE /orders/:id': 'Delete order',
      'GET /api/stats': 'Get order statistics',
      'POST /api/products': 'Create product',
      'GET /api/products': 'Get all products',
      'POST /api/users': 'Create user',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

// ============================================
// ORDERS ROUTES (File-based)
// ============================================

// Create new order (from cart checkout)
app.post('/orders', (req, res) => {
  try {
    const { user, items, totalPrice, shippingAddress, phone, paymentMethod, customerName } = req.body;

    // Validation
    if (!user || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: user, items' 
      });
    }

    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return res.status(400).json({ 
        error: 'Invalid totalPrice' 
      });
    }

    // Calculate subtotal, shipping, discount
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10; // Fixed shipping
    const discount = 0; // Can be calculated based on coupons
    const total = subtotal + shipping - discount;

    // Create order object - Use customerName if provided, otherwise extract from email
    const newOrder = {
      id: generateOrderId(),
      customer: customerName || user.split('@')[0] || 'Guest', 
      email: user,
      phone: phone || 'Not provided',
      products: items.map(item => `${item.name} x${item.quantity}`).join(', '),
      productDetails: items,
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      total: total,
      status: 'Pending',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      shippingAddress: shippingAddress || 'Not provided',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Read existing orders
    const orders = readOrders();
    
    // Add new order to beginning
    orders.unshift(newOrder);
    
    // Save orders
    const saved = writeOrders(orders);
    
    if (!saved) {
      return res.status(500).json({ 
        error: 'Failed to save order' 
      });
    }

    console.log(` New order created: ${newOrder.id} for ${newOrder.customer} (${newOrder.email})`);

    res.status(201).json({ 
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get all orders
app.get('/orders', (req, res) => {
  try {
    const orders = readOrders();
    
    // Optional filtering
    const { status, date, customer } = req.query;
    
    let filteredOrders = orders;
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (date) {
      filteredOrders = filteredOrders.filter(o => o.date === date);
    }
    
    if (customer) {
      filteredOrders = filteredOrders.filter(o => 
        o.customer.toLowerCase().includes(customer.toLowerCase()) ||
        o.email.toLowerCase().includes(customer.toLowerCase())
      );
    }

    res.json({ 
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders 
    });

  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve orders',
      details: error.message 
    });
  }
});

// Get single order by ID
app.get('/orders/:id', (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    
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
      error: 'Failed to retrieve order',
      details: error.message 
    });
  }
});

// Update order status
app.put('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ 
        error: 'Order not found' 
      });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    writeOrders(orders);
    
    console.log(` Order ${req.params.id} status updated to: ${status}`);
    
    res.json({ 
      success: true,
      message: 'Order status updated',
      order: orders[orderIndex]
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      details: error.message 
    });
  }
});

// Delete order
app.delete('/orders/:id', (req, res) => {
  try {
    const orders = readOrders();
    const filteredOrders = orders.filter(o => o.id !== req.params.id);
    
    if (orders.length === filteredOrders.length) {
      return res.status(404).json({ 
        error: 'Order not found' 
      });
    }
    
    writeOrders(filteredOrders);
    
    console.log(` Order ${req.params.id} deleted`);
    
    res.json({ 
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      error: 'Failed to delete order',
      details: error.message 
    });
  }
});

// Get order statistics
app.get('/api/stats', (req, res) => {
  try {
    const orders = readOrders();
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Pending').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      shipped: orders.filter(o => o.status === 'Shipped').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      todayOrders: orders.filter(o => o.date === today).length,
      todayRevenue: orders
        .filter(o => o.date === today)
        .reduce((sum, o) => sum + o.total, 0)
    };
    
    res.json({ 
      success: true,
      stats 
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve statistics',
      details: error.message 
    });
  }
});

// ============================================
// MONGOOSE ROUTES (Products & Users)
// ============================================

// Use product routes
app.use('/api/products', productRoutes);

// Use user routes  
app.use('/api/users', userRoutes);

app.use('/api/orders', orderRoutes);



// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log(' ═══════════════════════════════════════════════════════');
  console.log('   DELUX PERFUMES - Complete Management Server');
  console.log('═══════════════════════════════════════════════════════');
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` Orders stored in: ${ORDERS_FILE}`);
  console.log(` MongoDB database: deluxperfumes`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`   POST   http://localhost:${PORT}/orders`);
  console.log(`   GET    http://localhost:${PORT}/orders`);
  console.log(`   PUT    http://localhost:${PORT}/orders/:id/status`);
  console.log(`   DELETE http://localhost:${PORT}/orders/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/stats`);
  console.log(`   POST   http://localhost:${PORT}/api/products`);
  console.log(`   GET    http://localhost:${PORT}/api/products`);
  console.log(`   POST   http://localhost:${PORT}/api/users`);
  console.log(`   GET    http://localhost:${PORT}/api/users`);
  console.log(`   GET    http://localhost:${PORT}/api/users/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/users/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n Shutting down server...');
  mongoose.connection.close();
  process.exit(0);
});