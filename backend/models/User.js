const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mentorProfileSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  title: { type: String, default: '' },
  bio: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  industries: { type: [String], default: [] },
  linkedinUrl: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, default: '' },
}, { _id: false });

const companyProfileSchema = new mongoose.Schema({
  companyName: { type: String, default: '' },
  industry: { type: String, default: '' },
  description: { type: String, default: '' },
  teamSize: { type: Number, default: 0 },
  mentorRequirements: { type: String, default: '' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
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
  mentorProfile: {
    type: mentorProfileSchema,
    default: null,
  },
  companyProfile: {
    type: companyProfileSchema,
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
  return obj;
};

module.exports = mongoose.model('User', userSchema);
