import jwt from 'jsonwebtoken';

// Generate Access Token (short lived, e.g. 1d or 7d)
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretfallback', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate an OTP or password reset token
export const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 10);
};
