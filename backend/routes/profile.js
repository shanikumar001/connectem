const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile — get current user's profile
router.get('/', auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/profile — update profile
router.put('/', auth, async (req, res) => {
  try {
    const { mentorProfile, companyProfile } = req.body;
    const user = req.user;

    if (user.role === 'mentor' && mentorProfile) {
      user.mentorProfile = mentorProfile;
    } else if (user.role === 'company' && companyProfile) {
      user.companyProfile = companyProfile;
    }

    await user.save();
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/complete — check if profile is complete
router.get('/complete', auth, async (req, res) => {
  try {
    const user = req.user;
    let isComplete = false;

    if (user.role === 'mentor' && user.mentorProfile) {
      const mp = user.mentorProfile;
      isComplete = !!(mp.fullName && mp.title && mp.bio);
    } else if (user.role === 'company' && user.companyProfile) {
      const cp = user.companyProfile;
      isComplete = !!(cp.companyName && cp.industry && cp.description);
    }

    res.json({ isComplete });
  } catch (error) {
    console.error('Profile complete check error:', error);
    res.status(500).json({ error: 'Failed to check profile completeness' });
  }
});

module.exports = router;
