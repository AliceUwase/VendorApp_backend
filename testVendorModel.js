const mongoose = require('mongoose');
const User = require('./src/models/User');
const Vendor = require('./src/models/Vendor');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://user1:twentyfifth@cluster0.ownupsm.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected\n');
    testVendorModel().catch(err => {
      console.error('Test run failed:', err);
      mongoose.connection.close();
    });
  })
  .catch(err => console.log('❌ Connection error:', err));

const testVendorModel = async () => {
    try {
        console.log('Cleaning up old test data...');
        await Vendor.deleteOne({ businessName: 'Test Vendor' });
        console.log('\n--- Testing Vendor Model ---\n');

        // Test 1: Create a vendor
        console.log('Test 1: Creating a vendor owner...');
        const owner = await User.create({
              name: 'John Vendor',
              email: 'vendorowner@test.com',
              password: 'vendor123',
              userType: 'vendor'
        });
        console.log('✅ Vendor owner created:', owner.name);

        // Test 2: Create a vendor profile
       console.log('\nTest 2: Creating vendor profile...');
       const vendor = await Vendor.create({
            ownerId: owner._id,
            businessName: 'Test Cafe Rwanda',
            description: 'A cozy coffee shop serving fresh brews and pastries',
            category: 'Coffee Shop',
            address: 'KG 5 Ave, Kimihurura',
            city: 'Kigali',
            phone: '+250788123456',
            hours: 'Mon-Fri: 8AM-6PM, Sat-Sun: 9AM-5PM',
            photos: ['/photos/cafe1.jpg', '/photos/cafe2.jpg']
            }); 

        console.log('✅ Vendor created:', vendor.businessName);
        console.log('   Category:', vendor.category);
        console.log('   Location:', vendor.city);
        console.log('   Rating:', vendor.averageRating);

        // Test 3: finding a vendor
        console.log('\nTest 3: Finding vendor by business name...');
        const foundVendor = await Vendor.findOne({ businessName: 'Test Cafe Rwanda' });
        console.log('✅ Vendor found:', foundVendor.businessName);

        // Test 4: finding vendor with owner info
        console.log('\nTest 4: Finding vendor with owner info...');
        const vendorWithOwner = await Vendor.findOne({ businessName: 'Test Cafe Rwanda' })
            .populate('ownerId', 'name email');
        console.log('✅ Vendor with owner:', {
        business: vendorWithOwner.businessName,
        owner: vendorWithOwner.ownerId.name,
        ownerEmail: vendorWithOwner.ownerId.email
        });

        // cleaning up test data
    await Vendor.deleteOne({ _id: vendor._id });
    await User.deleteOne({ _id: owner._id });
    console.log('\n🗑️  Test vendor and owner cleaned up');
    console.log('✅ VENDOR MODEL TESTS PASSED!\n');
    
  } catch (error) {
    console.log('❌ Vendor model test failed:', error.message);
    // Cleanup on error
    await User.deleteOne({ email: 'vendorowner@test.com' });
    await Vendor.deleteOne({ businessName: 'Test Cafe Rwanda' });
    throw error;
  }
};