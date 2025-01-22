import { Request, Response } from "express";
import { UserRegisterDto, UserLoginDto } from "../common/dto/base.dto";
import { UserService } from "../user/user.service";

export const registerUser = async (
  req: Request<{}, {}, UserRegisterDto>,
  res: Response
): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    const { newUser, accessToken, refreshToken } =
      await UserService.registerUser(name, email, password, role);

    res
      .status(201)
      .json({ message: "User registered", accessToken, refreshToken });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, UserLoginDto>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await UserService.loginUser(
      email,
      password
    );

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || "Invalid credentials" });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  try {
    const { newAccessToken } = await UserService.refreshAccessToken(
      refreshToken
    );
    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    console.error(err);
    res.status(401).json({ message: err.message || "Invalid refresh token" });
  }
};

export const sendPasswordResetToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const response = await UserService.sendPasswordResetToken(email);
    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res
      .status(400)
      .json({ message: err.message || "Error sending password reset token" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const response = await UserService.resetPassword(token, newPassword);
    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res
      .status(400)
      .json({ message: err.message || "Error resetting password" });
  }
};
