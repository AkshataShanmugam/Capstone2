// models/Wishlist.js
const mongoose = require('mongoose');

// Define the wishlist schema
const wishlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  date: { type: String, required: true },
  thumbnail: { type: String },
  
  // Add reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // Model name to reference
    required: true // Ensure this field is always set
  }
});

// Create and export the Wishlist model
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
