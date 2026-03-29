const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

function getAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function getRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

function getRefreshTokenExpiryDate() {
  const ttlMs = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ttlMs);
}

function getRefreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
    path: '/api/auth',
  };
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  getRefreshTokenExpiryDate,
  getRefreshCookieOptions,
};
