
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// ✅ Nodemailer transporter using Gmail (app password required)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // App password generated via Google
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      full_name: full_name || '',
      isVerified: false,
      verificationToken,
      role: 'user' // Default role
    });

    await user.save();

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your Email - Inventory Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to Inventory Pro!</h2>
          <p>Hello ${full_name || email},</p>
          <p>Thank you for registering with Inventory Pro. Please click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>The Inventory Pro Team</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// === VERIFY EMAIL ===
router.get('/verify', async (req, res) => {
  const token = req.query.token;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h2 style="color: #DC2626;">Invalid Verification Link</h2>
          <p>The verification link is invalid or has expired.</p>
        </div>
      `);
    }

    if (user.isVerified) {
      return res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h2 style="color: #059669;">Email Already Verified</h2>
          <p>Your email has already been verified. You can now log in to your account.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Go to App</a>
        </div>
      `);
    }

    // Verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h2 style="color: #059669;">Email Successfully Verified!</h2>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Go to App</a>
      </div>
    `);
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h2 style="color: #DC2626;">Verification Error</h2>
        <p>An error occurred during email verification. Please try again.</p>
      </div>
    `);
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Extended to 7 days
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// === GET USER PROFILE ===
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -verificationToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role || 'user',
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// === LOGOUT (Optional - mainly for token blacklisting if needed) ===
router.post('/logout', (req, res) => {
  // For JWT tokens, logout is typically handled on the frontend by removing the token
  res.json({ message: 'Logout successful' });
});

module.exports = router;
