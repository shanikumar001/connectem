require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestAccessRoutes = require('./routes/requestAccess');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

if (isProduction) {
  app.set('trust proxy', 1);
}

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error('MONGODB_URI and JWT_SECRET are required environment variables.');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please retry later.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request-access', requestAccessRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Seed admin user
    const User = require('./models/User');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      try {
        const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
        if (!existingAdmin) {
          const admin = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'mentor',
            isAdmin: true,
            isProfileCompleted: true,
            isApproved: true,
          });
          await admin.save();
          console.log('✅ Admin user created:', adminEmail);
        } else {
          console.log('ℹ️ Admin user already exists:', adminEmail);
        }
      } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
