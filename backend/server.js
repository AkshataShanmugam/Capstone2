// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const scriptRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const wishlistRoutes = require('./routes/wishlist');

require('dotenv').config();

console.log(process.env); 

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI) // Connect to MongoDB
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

app.use('/api/scripts', scriptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("MongoDB URI:", process.env.MONGO_URI); // This should print your MongoDB URI