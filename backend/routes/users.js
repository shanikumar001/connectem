const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/directory - all completed profiles (for logged-in users)
router.get('/directory', auth, async (_req, res) => {
  try {
    const users = await User.find({ isProfileCompleted: true })
      .select('email role mentorProfile companyProfile createdAt')
      .sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    console.error('Directory error:', error);
    return res.status(500).json({ error: 'Failed to fetch directory' });
  }
});

// GET /api/users/public/selected - only selected mentors
router.get('/public/selected', async (_req, res) => {
  try {
    const users = await User.find({ 
      role: 'mentor', 
      status: 'selected', 
      isProfileCompleted: true 
    })
    .select('mentorProfile createdAt')
    .sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    console.error('Public selected error:', error);
    return res.status(500).json({ error: 'Failed to fetch selected mentors' });
  }
});

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

// GET /api/users/:id - admin only get user
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokenHash -passwordResetTokenHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

// PATCH /api/users/:id - admin only update user
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { role, isAdmin, isProfileCompleted, isApproved, status, mentorProfile, companyProfile } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (role) user.role = role;
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;
    if (typeof isProfileCompleted === 'boolean') user.isProfileCompleted = isProfileCompleted;
    if (typeof isApproved === 'boolean') user.isApproved = isApproved;
    if (status) user.status = status;
    if (mentorProfile) user.mentorProfile = { ...user.mentorProfile, ...mentorProfile };
    if (companyProfile) user.companyProfile = { ...user.companyProfile, ...companyProfile };

    await user.save();
    return res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

// PATCH /api/users/:id/status - admin only update status
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = status;
    // Auto-approve if selected
    if (status === 'selected') {
      user.isApproved = true;
    }
    
    await user.save();
    return res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
});

// DELETE /api/users/:id - admin only delete user
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

// POST /api/users/:id/approve - admin only approve
router.post('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isApproved = true;
    if (user.status === 'pending') {
      user.status = 'interview'; // Default to interview if approved from pending
    }
    await user.save();
    return res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Approve user error:', error);
    return res.status(500).json({ error: 'Failed to approve user' });
  }
});

module.exports = router;
