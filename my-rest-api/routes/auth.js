const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// ✅ Nodemailer transporter using Gmail (app password required)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // App password generated via Google
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });

    await user.save();

    const verificationLink = `https://yourdomain.com/api/auth/verify?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your Email',
      html: `
        <p>Hello ${email},</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === VERIFY EMAIL ===
router.get('/verify', async (req, res) => {
  const token = req.query.token;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).send('Invalid or expired verification link.');
    if (user.isVerified) return res.send('Email already verified.');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send('Email successfully verified.');
  } catch (err) {
    res.status(500).send('An error occurred during email verification.');
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
