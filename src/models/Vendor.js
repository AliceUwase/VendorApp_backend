const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // References the User model
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        unique: true, // business names must be unique
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: { // ✅ Add this - only allow specific categories
            values: [
                'Catering',
                'Food Truck',
                'Coffee Shop',
                'Pastry Shop',
                'Cake Shop',
                'Restaurant',
                'Cantine',
                'Pizzeria',
                'Burger Joint'
            ],
            message: 'Category must be a valid food vendor type'
        }
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            'Please provide a valid phone number'
        ]
    },
    hours: {
        type: String,
    },
    photos: {
        type: [String], // Array of strings
    },
    averageRating: {
        type: Number,
        default: 0, // Auto-calculated, default to 0
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    reviewCount: {
        type: Number,
        default: 0, // Auto-calculated, default to 0
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
