const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - admin only list of users
router.get('/', auth, adminOnly, async (_req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshTokenHash -passwordResetTokenHash')
      .sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Failed to list users' });
  }
});

module.exports = router;
