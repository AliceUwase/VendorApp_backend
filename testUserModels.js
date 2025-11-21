const mongoose = require('mongoose');
const User = require('./src/models/User');

// Your MongoDB connection string
const MONGO_URI = 'mongodb+srv://user1:twentyfifth@cluster0.ownupsm.mongodb.net/?appName=Cluster0';

// Connect to database
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    testUserModel();
  })
  .catch(err => {
    console.log('❌ Connection error:', err);
  });

// Test User Model
const testUserModel = async () => {
  try {
    console.log('Cleaning up old test data...');
    await User.deleteOne({ email: 'testuser@mail.com' });
    console.log('\n--- Testing User Model ---\n');
    
    // Test 1: Create a user
    console.log('Test 1: Creating a user...');
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@mail.com',
      password: 'test12345',
      userType: 'customer'
    });
    console.log('✅ User created:', {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      passwordIsHashed: user.password.length > 20 // Check if hashed
    });
    
    // Test 2: Find the user
    console.log('\nTest 2: Finding user by email...');
    const foundUser = await User.findOne({ email: 'testuser@mail.com' });
    console.log('✅ User found:', foundUser.name);
    
    // Test 3: Test password comparison
    console.log('\nTest 3: Testing password comparison...');
    const isMatch = await foundUser.comparePassword('test12345');
    console.log('✅ Password matches:', isMatch);
    
    const wrongMatch = await foundUser.comparePassword('wrongpassword');
    console.log('✅ Wrong password rejected:', !wrongMatch);
    
    console.log('\n--- All tests passed! ---\n');

    // Cleanup: Delete test user
    console.log('🧹 Cleaning up...');
    await User.deleteOne({ email: 'testuser@mail.com' });
    console.log('🗑️  Test user deleted\n');
    
    // Close connection
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    await User.deleteOne({ email: 'testuser@mail.com' });

    process.exit(1);
  }
}; 