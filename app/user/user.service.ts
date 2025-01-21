import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../user/user.schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../common/helper/token.helper";
import { sendPasswordResetEmail } from "../common/services/email.service";

export class UserService {
  // Register a new user
  static async registerUser(
    name: string,
    email: string,
    password: string,
    role: string
  ) {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User already exists");

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Generate tokens after user creation
    const accessToken = generateAccessToken(
      newUser._id.toString(),
      newUser.role
    );
    const refreshToken = generateRefreshToken(
      newUser._id.toString(),
      newUser.role
    );

    return { newUser, accessToken, refreshToken };
  }

  // Login an existing user
  static async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Generate tokens after successful login
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return { user, accessToken, refreshToken };
  }

  // Refresh the access token using the refresh token
  static async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error("Invalid refresh token");

    const { id, role } = decoded as { id: string; role: string };
    const newAccessToken = generateAccessToken(id, role);

    return { newAccessToken };
  }

  // Generate and send a password reset token
  static async sendPasswordResetToken(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save the hashed token and expiration to the user document
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save();

    // Generate reset URL and send the reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl); // Pass email and token

    return { message: "Password reset token sent to email" };
  }

  // Reset password using the token
  static async resetPassword(resetToken: string, newPassword: string) {
    // Hash the provided token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find a user with the matching reset token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
    });
    if (!user) {
      throw new Error("Invalid or expired password reset token");
    }

    // Update the password and clear the reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: "Password has been reset successfully" };
  }
}
