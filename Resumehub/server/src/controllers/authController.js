import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';
import { sendEmail } from '../lib/email.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        authProvider: 'LOCAL',
        isVerified: false,
        otp,
        otpExpires,
      },
    });

    // Send Welcome Email asynchronously
    sendEmail({
      to: user.email,
      subject: 'Verify your ResumeHub account',
      html: `<h3>Hi ${user.name},</h3><p>Welcome to ResumeHub! Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
    }).catch(err => console.error('Failed to send welcome email', err));

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // If user registered via Google, they might not have a password
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    if (user.authProvider === 'GOOGLE' && !user.password) {
      return res.status(401).json({ success: false, error: 'Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/google
export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Google token is required' });
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return res.status(400).json({ success: false, error: 'Invalid Google access token' });
    }

    const payload = await response.json();
    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          authProvider: 'GOOGLE',
          isVerified: true
        }
      });
      // Send Welcome Email for Google users too
      sendEmail({
        to: user.email,
        subject: 'Welcome to ResumeHub via Google!',
        html: `<h3>Hi ${user.name},</h3><p>Welcome to ResumeHub!</p>`
      }).catch(err => console.error('Failed to send welcome email', err));
    } else {
      // If user exists but no googleId, link the account
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, authProvider: 'GOOGLE' }
        });
      }
    }

    const jwtToken = generateToken(user.id);

    res.json({
      success: true,
      token: jwtToken,
      user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified },
      isNewUser
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Please provide email and OTP.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'User is already verified.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP.' });
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null
      }
    });

    res.json({
      success: true,
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, isVerified: updatedUser.isVerified }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide email.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'User is already verified.' });
    }

    // Rate Limiting: Check if the last OTP was sent less than 2 minutes ago
    if (user.otpExpires) {
      // Since otpExpires is always set to Date.now() + 10 mins, the time it was generated is 10 mins prior
      const lastSentAt = new Date(user.otpExpires.getTime() - 10 * 60 * 1000);
      const timeSinceLastSent = Date.now() - lastSentAt.getTime();
      const twoMinutesMs = 2 * 60 * 1000;
      
      if (timeSinceLastSent < twoMinutesMs) {
        const remainingSeconds = Math.ceil((twoMinutesMs - timeSinceLastSent) / 1000);
        return res.status(429).json({ 
          success: false, 
          error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires }
    });

    sendEmail({
      to: user.email,
      subject: 'Your new ResumeHub verification code',
      html: `<h3>Hi ${user.name},</h3><p>Your new verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
    }).catch(err => console.error('Failed to send OTP resend email', err));

    res.json({ success: true, message: 'OTP resent successfully.' });
  } catch (error) {
    next(error);
  }
};
