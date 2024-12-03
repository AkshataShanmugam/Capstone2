// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  date: { type: String, required: true },
  thumbnail: { type: String },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
