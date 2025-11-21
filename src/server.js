const dotenv = require('dotenv');
dotenv.config();

const config = require('./config/config');
const app = require('./App.js');
const mongoose = require('mongoose');
const currentConfig = config.development;
const { port, mongoUrl } = currentConfig;
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Validate MongoDB URL
if (!mongoUrl || typeof mongoUrl !== 'string') {
  console.error('❌ MONGO URL is not defined. Set MONGODB_URL in .env file');
  process.exit(1);
}

// Validate port
if (!port) {
  console.error('❌ PORT is not defined. Set PORT in .env file');
  process.exit(1);
}

// Register routes BEFORE starting the server
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Vendor App API is running' });
});

// Start server and connect to database
const server = app.listen(port, () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(mongoUrl)
    .then(() => {
      console.log('✅ Database connected successfully!');
      console.log(`The server is up and running on port ${port}`);
    })
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
      process.exit(1);
    });


});




