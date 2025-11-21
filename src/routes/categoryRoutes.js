const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  getVendorsInCategory,
} = require('../controllers/categoryController');

// PUBLIC ROUTES 
// get category by name
router.get('/name/:name', getCategoryByName);

// get all categories
router.get('/', getAllCategories);

// get single category by ID
router.get('/:id', getCategoryById);

// get vendors in category
router.get('/:id/vendors', getVendorsInCategory);

module.exports = router;
