import jwt from 'jsonwebtoken';

// Generate access token
export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};

// Verify access token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  } catch (err) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (err) {
    return null;
  }
};
