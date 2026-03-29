const express = require('express');
const crypto = require('crypto');
const validator = require('validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const {
  getAccessToken,
  getRefreshToken,
  getRefreshTokenExpiryDate,
  getRefreshCookieOptions,
} = require('../utils/tokens');

const router = express.Router();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function clearRefreshCookie(res) {
  const cookieOptions = getRefreshCookieOptions();
  return res.clearCookie('refreshToken', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  });
}

async function issueSession(res, user) {
  const refreshToken = getRefreshToken();
  const refreshExpiresAt = getRefreshTokenExpiryDate();
  await user.setRefreshToken(refreshToken, refreshExpiresAt);
  await user.save();

  const accessToken = getAccessToken(user);
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
  return accessToken;
}

router.post('/register', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!['mentor', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "mentor" or "company"' });
    }
    if (!validator.isStrongPassword(String(password), { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({ error: 'Password must be at least 8 chars and include uppercase + number' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, role });
    const accessToken = await issueSession(res, user);

    return res.status(201).json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = await issueSession(res, user);
    return res.json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const user = await User.findOne({
      refreshTokenHash,
      refreshTokenExpiresAt: { $gt: new Date() },
    });
    if (!user || !(await user.matchesRefreshToken(refreshToken))) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = await issueSession(res, user);
    return res.json({ accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ error: 'Server error during token refresh' });
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.clearRefreshToken();
    await req.user.save();
    clearRefreshCookie(res);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Server error during logout' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email || !validator.isEmail(email)) {
      return res.json({ message: 'If that email is registered, reset instructions have been generated.' });
    }

    const user = await User.findOne({ email });
    if (user) {
      const resetToken = user.createPasswordResetToken();
      await user.save();
      return res.json({
        message: 'If that email is registered, reset instructions have been generated.',
        resetToken,
      });
    }
    return res.json({ message: 'If that email is registered, reset instructions have been generated.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Server error during forgot password' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and newPassword are required' });
    }
    if (!validator.isStrongPassword(String(newPassword), { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({ error: 'Password must be at least 8 chars and include uppercase + number' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.clearPasswordResetToken();
    user.clearRefreshToken();
    await user.save();
    clearRefreshCookie(res);

    return res.json({ message: 'Password reset successful. Please login again.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Server error during password reset' });
  }
});

router.get('/me', auth, async (req, res) => {
  return res.json({ user: req.user.toJSON() });
});

module.exports = router;
