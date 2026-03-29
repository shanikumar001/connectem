const express = require('express');
const validator = require('validator');
const RequestAccess = require('../models/RequestAccess');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/request-access — submit a request (no auth required)
router.post('/', async (req, res) => {
  try {
    const { name, email, roleInterest, message } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!name || !normalizedEmail || !roleInterest || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (String(message).length < 20) {
      return res.status(400).json({ error: 'Message must be at least 20 characters' });
    }

    const submission = new RequestAccess({
      name: String(name).trim(),
      email: normalizedEmail,
      roleInterest: String(roleInterest).trim(),
      message: String(message).trim(),
    });
    await submission.save();

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Submit request access error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// GET /api/request-access — list all requests (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const submissions = await RequestAccess.find().sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (error) {
    console.error('Get request access error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

module.exports = router;
