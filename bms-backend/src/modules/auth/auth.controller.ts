import { Request, Response, NextFunction } from "express";
import * as OtpService from "./otp.service";
import * as UserService from "../user/user.service";
import * as TokenService from "./token.sevice";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";
import { loginUser, signupUser } from "./auth.service";
import { UserModel } from "../user/user.model";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      path:"/",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      token:result.token,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new createHttpError.BadRequest("Email is required"));
    }

    if (!isValidEmail(email)) {
      return next(new createHttpError.BadRequest("Invalid email format"));
    }

    const otp = OtpService.generateOTP();

    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;

    const data = `${email}.${otp}.${expires}`;

    const hashedOTP = OtpService.hashOTP(data);

    await OtpService.sendOTPtoEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      hash: `${hashedOTP}.${expires}`,
      email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, hash } = req.body;

    if (!email || !otp || !hash) {
      return next(
        new createHttpError.BadRequest("All fields are required")
      );
    }

    const [hashedOTP, expires] = hash.split(".");

    if (Date.now() > Number(expires)) {
      return next(new createHttpError.Gone("OTP expired"));
    }

    const data = `${email}.${otp}.${expires}`;

    const isValid = OtpService.verifyOTP(hashedOTP, data);

    if (!isValid) {
      return next(new createHttpError.Unauthorized("Invalid OTP"));
    }

    // Find existing user
    let user = await UserService.getUserByEmail(email);

    // Create user if not exists
    if (!user) {
      user = await UserService.createUser({
        email,
        name: "New User",
      });
    }

    // Activate user
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { activateUser: true },
      { new: true }
    );

    // Generate tokens
    const { accessToken, refreshToken } =
      TokenService.generateToken({
        _id: String(user._id),
        email: user.email,
      });

    // Store refresh token
    await TokenService.storeRefreshToken(
      String(user._id),
      refreshToken
    );

    // Cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path:"/",
      maxAge: 1000 * 60 * 60,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path:"/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await TokenService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};