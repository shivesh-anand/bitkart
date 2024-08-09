import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  generateOTP,
  resendOTP,
  sendOTP,
  validateOTP,
} from "../utils/nodemailer.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerController = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const newUser = new User({
      firstName,
      lastName,
      email,
      hashedPassword,
      otp,
      isVerified: false,
      otpRequestDate: new Date(),
      otpRequestCount: 1,
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(201).json({
      message: "User registered. OTP sent to email.",
      user: { _id: newUser._id },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { otp } = req.body;
  console.log("User ID:", userId);
  console.log("OTP:", otp);

  try {
    const isValid = await validateOTP(userId, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(userId);
    if (user) {
      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({
          message: "Account verified successfully",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
            token: token,
          },
        });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const resendOtpController = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    resendOTP(userId, user.email, req, res);
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email }).select("+hashedPassword");
    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword!);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpLastRequestedAt = new Date();
      await user.save();

      await sendOTP(email, otp);

      return res.status(403).json({
        message:
          "Your account is not verified. A verification email has been sent to your email address.",
        userId: user._id,
      });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
        token,
        message: "Logged in successfully",
      });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
