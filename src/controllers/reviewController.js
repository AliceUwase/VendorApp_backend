const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const { updateVendor } = require('./vendorController');

// create a review for a vendor
const createReview = async (req, res) => {
    try {
        // get data from request
        const { vendorId, rating, comment } = req.body;

        // Validate required fields
        if (!vendorId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide vendor, rating and Comment'
            });
        }
        // check if vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // create review

        const review = await Review.create({
            userId: req.user._id,
            vendorId,
            rating,
            comment
        });

        // update vendor's average rating and review count
        await updateVendorRating(vendorId);

        // populate user info before sending response
        await review.populate('userId', 'name email');

        // send response
        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        // handling duplicate review error
        if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this vendor'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};
// helper function to calculate and update vendor rating 
const updateVendorRating = async (vendorId) => {
  try {
    // get all reviews for this vendor
    const reviews = await Review.find({ vendorId });

    if (reviews.length === 0) {
      // No reviews - reset to 0
      await Vendor.findByIdAndUpdate(vendorId, {
        averageRating: 0,
        reviewCount: 0
      });
    } else {
      // calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;

      // update vendor
      await Vendor.findByIdAndUpdate(vendorId, {
        averageRating: Math.round(avgRating * 10) / 10, 
        reviewCount: reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating vendor rating:', error);
  }
};

// get all reviews for a vendor
const getReviewsByVendor = async (req, res) => {
  try {
    // get vendor ID from params
    const { vendorId } = req.params;

    // check if vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // get pagination params
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    // find reviews
    const reviews = await Review.find({ vendorId })
      .populate('userId', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // get total count
    const total = await Review.countDocuments({ vendorId });

    // send response
    res.status(200).json({
      success: true,
      vendorName: vendor.businessName,
      averageRating: vendor.averageRating,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reviews
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// update a review
const updateReview = async (req, res) => {
  try {
    // find review
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // check if user is the author
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this review'
      });
    }

    // update review fields (only if provided)
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment;

    // saving updated review
    await review.save();

    // recalculates vendor rating (if rating changed)
    if (req.body.rating) {
      await updateVendorRating(review.vendorId);
    }

    // populate and send response
    await review.populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// delete a review
const deleteReview = async (req, res) => {
  try {
    // find review
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // check if user is the author
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review'
      });
    }

    // store vendor ID before deleting
    const vendorId = review.vendorId;

    // delete review
    await Review.findByIdAndDelete(req.params.id);

    // update vendor rating
    await updateVendorRating(vendorId);

    // send response
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// get all reviews by a user
const getMyReviews = async (req, res) => {
  try {
    // get pagination params
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // find user's reviews
    const reviews = await Review.find({ userId: req.user.id })
      .populate('vendorId', 'businessName category address city')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    // get total count
    const total = await Review.countDocuments({ userId: req.user.id });

    // send response
    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your reviews',
      error: error.message
    });
  }
};

module.exports = {
    createReview,
    getReviewsByVendor,
    updateReview,
    deleteReview,
    getMyReviews   
};
