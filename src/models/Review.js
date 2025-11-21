const mongoose = require('mongoose');
const { create } = require('./Vendor');

const reviewSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // References the User model
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Vendor', // References the Vendor model,
        },
        rating: {
            type: Number,
            required: true,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
        },
        comment:{
            type: String,
            required: [true, 'Review comment is required'],
            trim: true,
            maxlength: [500, 'Review comment cannot exceed 500 characters'],

        },
    },
    {
        timestamps: true
    }
);
   
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;