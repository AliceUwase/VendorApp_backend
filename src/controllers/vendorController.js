const Vendor = require('../models/Vendor');
const User = require('../models/User');

// create vendor function

const createVendor = async (req, res) => {
    try {
        const {
            businessName,
            description,
            category,
            address,
            city,
            phone,
            email
        } = req.body;
        // Validate required fields
        if (!businessName || !description || !category || !address || !city || !phone || !email) {
            return res.status(400).json({
                sucess: false,
                message: 'Please provide all required fields'
            });
        }

        // check if user is a vendor
        if (req.user.userType !== 'vendor') {
            return res.status(403).json({
                sucess: false,
                message: 'Only vendors can create business profiles'
            });
        }
            // check if business name already exists
        const existingVendor = await Vendor.findOne({ businessName });
        if (existingVendor) {
            return res.status(400).json({
                sucess: false,
                message: 'Business name alredy exists'
            });
        }
        // create vendor profile
        const vendor = await Vendor.create({
            ownerId: req.user.id,
            businessName,
            description,
            category,
            address,
            city,
            phone,
            email
        }); 

        // send response
        res.status(201).json({
            sucess: true,
            message: 'Vendor profile created successfully',
            data: vendor
        });
    } catch (error) { 
        // handles validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                sucess: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            sucess: false,
            message: 'Error crating vendor profile',
            error: error.message
        });
    }
};

// get all vendors function
const getAllVendors = async (req, res) => {
    try {
        // get query parameters for filtering
        const {
            category,
            city,
            page = 1,
            limit = 10,
            sort = 'createdAt'

        } = req.query;

        // build filter object
        const filter = {};
        if (category) filter.category = category;
        if (city) filter.city = {$regex: city, $options: 'i'};

        // calculate pagination 
        const skip = (page - 1) * limit;

        // get vendors from database
        const vendors = await Vendor.find(filter)
            .populate('ownerId', 'name email')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

            // get total count for pagination
            const total = await Vendor.countDocuments(filter);

            // send response
            res.status(200).json({
                success: true,
                count: vendors.length,
                total: total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                data: vendors
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching vendors',
            error: error.message
        });
    }
};
// get single vendor function
const getVendorById = async (req, res) => {
    try {
        // get vendor id from URL params
        const { id } = req.params;

        // find vendor and populate owner info
        const vendor = await Vendor.findById(id)
        .populate('ownerId', 'name email');

        // check if vendor exists
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }   

        // send response
        res.status(200).json({
            sucess: true,
            data: vendor
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
            message: 'Error fetching vendor',
            error: error.message
        });
    }
};
// update vendor function
const updateVendor = async (req, res) => {
    try {
        // find vendor by id
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({
                sucess: false,
                message: 'Vendor not found'
            });
        }
            // check if the logged in user is the owner of the vendor profile
        if (vendor.ownerId.tostring() !== req.user.id) {
            return res.status(403).json({
                sucess: false,
                message: 'You are not authorized to update this vendor profile'
            });

        }

        // check if new business name already exists
        if (req.body.businessName && req.body.businessName !== vendor.businessName) {
            const existingVendor = await Vendor.findOne({ 
                businessName: req.body.businessName,
                _id: { $ne: vendor._id }
            });
            if (existingVendor) {
                return res.status(400).json({
                    sucess: false,
                    message: 'Business name already exists'
                });
            }
        }
        // update vendor profile
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true, // return the updated document
                runValidators: true // run model validations
            });

            // send response
            res.status(200).json({
                sucess: true,
                message: 'Vendor profile updated successfully',
                data: updatedVendor
            });
    } catch (error) { // handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                sucess: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            sucess: false,
            message: 'Error updating vendor profile',
            error: error.message
        });
    }   
};
// delete vendor function
const deleteVendor = async (req, res) => {
    try {
        // find vendor 
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({
                sucess: false,
                message: 'Vendor not found'
            });
        }
        // check if the logged in user is the owner of the vendor profile
        if (vendor.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                sucess: false,
                message: 'You are not authorized to delete this vendor profile'
            });
        }
        // delete vendor profile
        await Vendor.findByIdAndDelete(req.params.id);

        // send response
        res.status(200).json({
            sucess: true,
            message: 'Vendor profile deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,  
            message: 'Error deleting vendor profile',
            error: error.message
        });
    }
};
// get vendors by category function
const getVendorsByCategory = async (req, res) => {
    try {
        // get category from URL params
        const { category } = req.params;

        // get page and limit from query parameters
        const { page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;

        // find vendors by category
        const vendors = await Vendor.find({category})
            .sort('-averageRating')
            .limit(parseInt(limit))
            .skip(skip);

        // get total count for pagination
        const total = await Vendor.countDocuments({ category });

        // check if category has vendors
        if (vendors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No vendors found in this category"

            });
        }
        // send response
        res.status(200).json({
            success: true, category,
            count: vendors.length,
            toayl: total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: vendors
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error fetching vendors by category',
            error: error.message
        });
    }
};

// search vendors function
const searchVendors = async (req, res) => {
    try {
        // get search query from query parameters
        const {q, city, category} = req.query;

        if (!q && !city && !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query, city, or category'
            });
        }   

        // build search filter
        const filter = {};

        // search by business name or description
        if (q) {
            filter.$or = [
                { businessName: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }

        // ssearch vendors in database
        const vendors = await Vendor.find(filter)
            .sort('-averageRating')
            .limit(20);

            // send response
            res.status(200).json({
                success: true,
                count: vendors.length,
                data: vendors
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching vendors',
            error: error.message
        });
    }
};

// get all vendors owned by current user function
const getMyVendors = async (req, res) => {
    try {
        // first check if user is a vendor
        if (req.user.userType !== 'vendor') {
            return req.status(403).json({
                success: false,
                message: 'Only vendors can access their business profiles'
            });
        }

        // find vendors owned by the logged in user
        const vendors = await Vendor.find({ ownerId: req.user.id })
            .sort('-createdAt');

            // send response
            res.status(200).json({
                success: true,
                count: vendors.length,
                data: vendors
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your vendors',
            error: error.message
        });
    }
};

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    getVendorsByCategory,
    searchVendors,
    getMyVendors
};



