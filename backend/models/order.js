const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: 'Not provided'
    },
    products: [{
        name: String,
        quantity: Number,
        price: Number,
        image: String
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        default: 10
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery'
    },
    shippingAddress: {
        type: String,
        default: 'Not provided'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


// Generate order ID
OrderSchema.pre('save', function(next) {
    if (!this.orderId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        this.orderId = `#${timestamp}${random}`.slice(0, 10);
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);