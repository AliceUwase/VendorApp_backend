const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorsByCategory,
  searchVendors,
  getMyVendors
} = require('../controllers/vendorController');


// PUBLIC ROUTES
router.get('/', getAllVendors);
router.get('/search', searchVendors);
router.get('/category/:category', getVendorsByCategory);
router.get('/:id', getVendorById);

// PRIVATE ROUTES (require authentication)
router.post('/', protect, createVendor);
router.get('/my-vendors', protect, getMyVendors);
router.put('/:id', protect, updateVendor);
router.delete('/:id', protect, deleteVendor);


module.exports = router; 
