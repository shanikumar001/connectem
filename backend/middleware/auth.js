const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    req.auth = {
      role: decoded.role || user.role,
      isAdmin: Boolean(decoded.isAdmin || user.isAdmin),
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || !req.auth?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (!roles.includes(req.auth?.role)) {
    return res.status(403).json({ error: 'Insufficient role permissions' });
  }
  return next();
};

module.exports = { auth, adminOnly, requireRoles };
