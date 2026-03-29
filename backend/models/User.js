const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mentorProfileSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  expertise: { type: String, default: '' },
  title: { type: String, default: '' },
  bio: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  industries: { type: [String], default: [] },
  linkedinUrl: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { _id: false });

const companyProfileSchema = new mongoose.Schema({
  companyName: { type: String, default: '' },
  industry: { type: String, default: '' },
  description: { type: String, default: '' },
  teamSize: { type: Number, default: 0 },
  mentorRequirements: { type: String, default: '' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  location: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['mentor', 'company'],
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isProfileCompleted: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  mentorProfile: {
    type: mentorProfileSchema,
    default: null,
  },
  companyProfile: {
    type: companyProfileSchema,
    default: null,
  },
  refreshTokenHash: {
    type: String,
    default: null,
  },
  refreshTokenExpiresAt: {
    type: Date,
    default: null,
  },
  passwordResetTokenHash: {
    type: String,
    default: null,
  },
  passwordResetExpiresAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokenHash;
  delete obj.passwordResetTokenHash;
  return obj;
};

userSchema.methods.setRefreshToken = async function (refreshToken, expiresAt) {
  this.refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  this.refreshTokenExpiresAt = expiresAt;
};

userSchema.methods.matchesRefreshToken = async function (refreshToken) {
  if (!this.refreshTokenHash || !this.refreshTokenExpiresAt) {
    return false;
  }
  if (this.refreshTokenExpiresAt.getTime() < Date.now()) {
    return false;
  }
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  return tokenHash === this.refreshTokenHash;
};

userSchema.methods.clearRefreshToken = function () {
  this.refreshTokenHash = null;
  this.refreshTokenExpiresAt = null;
};

userSchema.methods.createPasswordResetToken = function (ttlMs = 1000 * 60 * 15) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.passwordResetTokenHash = tokenHash;
  this.passwordResetExpiresAt = new Date(Date.now() + ttlMs);
  return rawToken;
};

userSchema.methods.matchesPasswordResetToken = function (rawToken) {
  if (!this.passwordResetTokenHash || !this.passwordResetExpiresAt) {
    return false;
  }
  if (this.passwordResetExpiresAt.getTime() < Date.now()) {
    return false;
  }
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return tokenHash === this.passwordResetTokenHash;
};

userSchema.methods.clearPasswordResetToken = function () {
  this.passwordResetTokenHash = null;
  this.passwordResetExpiresAt = null;
};

module.exports = mongoose.model('User', userSchema);
