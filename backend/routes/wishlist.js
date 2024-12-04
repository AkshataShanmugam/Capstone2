const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Store user id for later use
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get all wishlist items for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.userId }).populate('user', 'username'); // Fetch wishlists for the authenticated user
    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ error: "No wishlist found for this user" });
    }
    return res.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ error: 'Error fetching wishlist' });
  }
});

// Add an item to the wishlist for the authenticated user
router.post('/add', authenticateUser, async (req, res) => {
  try {
    const { title, link, date, thumbnail } = req.body;

    if (!title || !link) {
      return res.status(400).json({ error: 'Title and link are required' });
    }

    const newItem = new Wishlist({
      title,
      link,
      date,
      thumbnail,
      user: req.userId // Associate this wishlist item with the authenticated user
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added to wishlist', wishlist: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding item to wishlist' });
  }
});

// Remove an item from the wishlist for the authenticated user
router.post('/remove', authenticateUser, async (req, res) => {
  try {
    const { link } = req.body;

    // Find and remove the item by link, ensuring it's associated with the authenticated user
    const removedItem = await Wishlist.findOneAndDelete({ link, user: req.userId });

    if (!removedItem) {
      return res.status(404).json({ error: 'Item not found or not owned by this user' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing item from wishlist' });
  }
});

module.exports = router;
