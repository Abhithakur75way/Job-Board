import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppDataSource } from "../data-source";
import { User } from "./user.entity";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../common/helper/token.helper";
import { sendPasswordResetEmail } from "../common/services/email.service";
import { LessThanOrEqual } from "typeorm";

export class UserService {
  private static userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  static async registerUser(
    name: string,
    email: string,
    password: string,
    role: "employer" | "candidate"
  ) {
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) throw new Error("User already exists");

    const newUser = this.userRepository.create({ name, email, password, role });
    await this.userRepository.save(newUser);

    const accessToken = generateAccessToken(newUser.id.toString(), newUser.role);
    const refreshToken = generateRefreshToken(newUser.id.toString(), newUser.role);

    return { newUser, accessToken, refreshToken };
  }

  static async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user.id.toString(), user.role);
    const refreshToken = generateRefreshToken(user.id.toString(), user.role);

    return { user, accessToken, refreshToken };
  }


  static async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error("Invalid refresh token");

    const { id, role } = decoded as { id: string; role: string };
    const newAccessToken = generateAccessToken(id, role);

    return { newAccessToken };
  }

  static async sendPasswordResetToken(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await this.userRepository.save(user);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email as string, resetUrl);

    return { message: "Password reset token sent to email" };
  }

  static async resetPassword(resetToken: string, newPassword: string) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires:LessThanOrEqual(new Date()),
      },
    });
    if (!user) throw new Error("Invalid or expired password reset token");

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await this.userRepository.save(user);

    return { message: "Password has been reset successfully" };
  }
}
