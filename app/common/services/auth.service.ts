import jwt from 'jsonwebtoken';

export class AuthService {
  // Verify token
  static verifyToken(token: string, secret: string): { id: string } | null {
    try {
      return jwt.verify(token, secret) as { id: string };
    } catch (err) {
      return null;
    }
  }
}
