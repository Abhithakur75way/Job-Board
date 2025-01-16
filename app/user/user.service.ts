import bcrypt from 'bcryptjs';
import { User } from '../user/user.schema';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../common/helper/token.helper';

// UserService class to handle user-related logic
export class UserService {
  // Register a new user
  static async registerUser(name: string, email: string, password: string, role: string) {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Generate tokens after user creation
    const accessToken = generateAccessToken(newUser._id.toString(), newUser.role);
    const refreshToken = generateRefreshToken(newUser._id.toString(), newUser.role);

    return { newUser, accessToken, refreshToken };
  }

  // Login an existing user
  static async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate tokens after successful login
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return { user, accessToken, refreshToken };
  }

  // Refresh the access token using the refresh token
  static async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error('Invalid refresh token');

    const { id, role } = decoded as { id: string; role: string };
    const newAccessToken = generateAccessToken(id, role);

    return { newAccessToken };
  }
}
