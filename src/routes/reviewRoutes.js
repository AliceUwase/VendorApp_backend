const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviewsByVendor,
  updateReview,
  deleteReview,
  getMyReviews,
  
} = require('../controllers/reviewController');

const { protect } = require('../middlewares/authMiddleware');

// PUBLIC ROUTES
router.get('/vendor/:vendorId', getReviewsByVendor);


// PRIVATE ROUTES 
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews); 
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;