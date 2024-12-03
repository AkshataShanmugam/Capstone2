// routes/wishlist.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get all wishlist items
router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.find();
    if (!wishlist) {
      return res.status(404).json({ error: "No wishlist found" });
    }
    return res.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ error: 'Error fetching wishlist' });
  }
});

// Add an item to the wishlist
router.post('/add', async (req, res) => {
  try {
    const { title, link, date, thumbnail } = req.body;

    if (!title || !link) {
      return res.status(400).json({ error: 'Title and link are required' });
    }

    const newItem = new Wishlist({ title, link, date, thumbnail });
    await newItem.save();
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding item to wishlist' });
  }
});

// Remove an item from the wishlist
router.post('/remove', async (req, res) => {
  try {
    const { link } = req.body;

    // Find and remove the item by link
    await Wishlist.findOneAndDelete({ link });

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing item from wishlist' });
  }
});

module.exports = router;
