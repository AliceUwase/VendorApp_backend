const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        mongoUrl: process.env.MONGODB_URL,
        port: process.env.PORT || 3000
    },
    production: {
        mongoUrl: process.env.MONGODB_URL,
        port: process.env.PORT || 3000
    }
};