const express = require('express');
const router = express.Router();


// Simulate AI response (can be replaced with real AI API call)
const getAIResponse = (message) => {
  // Simple echo for now
  return `You said: ${message}`;
};


// Chat Route
router.post('/chat', async (req, res) => {
  const { message } = req.body;


  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }


  try {
    // Simulate delay (like waiting for an AI response)
    setTimeout(() => {
      const reply = getAIResponse(message);
      res.json({ reply });
    }, 1000); // Simulating a 1-second delay
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;