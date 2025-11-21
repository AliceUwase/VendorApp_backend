const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const MONGO_URI = 'mongodb+srv://user1:twentyfifth@cluster0.ownupsm.mongodb.net/?appName=Cluster0';

//  food vendor categories
const categories = [
    {
        categoryName: 'Catering',
        description: 'Services that provide food and drink for events and gatherings',
        icon: '👨‍🍳'
    },
    {
        categoryName: 'Food Truck',
        description: 'Mobile kitchens serving a variety of quick meals on the go',
        icon: '🍔'
    },
    {
        categoryName: 'Coffee Shop',
        description: 'Casual establishments offering coffee, tea, and light snacks',
        icon: '☕'
    },
    {
        categoryName: 'Pastry Shop',
        description: 'Specialty shops focused on baked goods and desserts',
        icon: '🥖'
    },
    {
        categoryName: 'Cake House',
        description: 'Bakeries specializing in custom cakes and pastries',
        icon: '🍰'
    },
    {
        categoryName: 'Restaurant',
        description: 'Full-service establishments offering a diverse menu of meals',
        icon: '🍽️'
    },
    {
        categoryName: 'Cantine',
        description: 'Casual dining places serving meals and drinks in a relaxed setting',
        icon: '🌮'
    },
    {
        categoryName: 'Pizzeria',
        description: 'Restaurants specializing in pizza and Italian cuisine',
        icon: '🍕'
    },
    {
        categoryName: 'Burger Joint',
        description: 'Casual eateries focused on burgers and comfort food',
        icon: '🍔'
    }
];

// Seed function
const seedCategories = async () => {
  try {
    // connecting  to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // add new categories
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    console.log('\nCategories added:');
    categories.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.categoryName}`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();