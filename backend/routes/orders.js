const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ===============================
// ORDER ROUTES (MongoDB Based)
// ===============================

// Create new order (from cart checkout)
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.put('/:id/status', orderController.updateOrderStatus);

// Delete order
router.delete('/:id', orderController.deleteOrder);

// Get order statistics
router.get('/stats/total', orderController.getOrderStats);

module.exports = router;