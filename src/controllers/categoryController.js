const Category = require('../models/Category');
const Vendor = require('../models/Vendor');

// Cget all  categories

const getAllCategories = async (req, res) => {
    try {
        // find all categories
        const categories = (await Category.find()).toSorted('categoryName');

        // for each category, count vendors under it
        const categoriesWithVendorCount = await Promise.all(categories.map(async (category) => {
            const vendorCount = await Vendor.countDocuments({ category: category.categoryName });

            return {
                _id: category._id,
                categoryName: category.categoryName,
                description: category.description,
                icon: category.icon,
                vendorCount: vendorCount,
                createdAt: category.createdAt
            };
        }));

        // send response
        res.status(200).json({
            success: true,
            count:categoriesWithCount.length,
            data: categoriesWithCount
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            message:'Error fetching categories',
            error:error.message
        });
    }
};

// get single category by ID

const getCategoryById = async (req, res) => {
  try {
    // find category
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // count vendors in this category
    const vendorCount = await Vendor.countDocuments({ 
      category: category.categoryName 
    });

    // send response
    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        vendorCount
      }
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// get category by name

const getCategoryByName = async (req, res) => {
  try {
    
    // find category by name 
    const category = await Category.findOne({ 
      categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category "${categoryName}" not found`
      });
    }

    // count vendors
    const vendorCount = await Vendor.countDocuments({ 
      category: category.categoryName 
    });

    // send response
    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        vendorCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// get vendors in category
// gets all vendors in a specific category

const getVendorsInCategory = async (req, res) => {
  try {
    // find category
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // get pagination params
    const { page = 1, limit = 10, sort = '-averageRating' } = req.query;
    const skip = (page - 1) * limit;

    // find vendors in this category
    const vendors = await Vendor.find({ category: category.categoryName })
      .populate('ownerId', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // get total count
    const total = await Vendor.countDocuments({ category: category.categoryName });

    // send response
    res.status(200).json({
      success: true,
      category: category.categoryName,
      count: vendors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: vendors
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: error.message
    });
  }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    getVendorsInCategory
};