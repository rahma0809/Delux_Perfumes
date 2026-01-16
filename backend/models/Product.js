const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['For Her', 'For Him', 'Unisex', 'Gift Sets', 'Uncategorized'],
        default: 'Uncategorized'
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);