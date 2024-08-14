import crypto from "crypto";
import { Request, Response } from "express";
import { transporter } from "../config/nodemailerConfig.js";
import User from "../models/userModel.js"; // Import your User model

export const generateOTP = (length = 6): string => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bitkart OTP Code",
    text: `Your OTP code is: ${otp}.Do not reply to this email. Valid for 10 minutes`,
  };

  await transporter.sendMail(mailOptions);
};

export const resendOTP = async (
  userId: string,
  email: string,
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const currentDate = new Date();
  const otpRequestDate = new Date(user.otpLastRequestedAt!);

  if (
    user.otpRequestsCount! >= 5 &&
    currentDate.getDate() === otpRequestDate.getDate()
  ) {
    res.status(429).json({ message: "Maximum OTP requests reached for today" });
    return;
  }

  if (currentDate.getDate() !== otpRequestDate.getDate()) {
    user.otpRequestsCount = 0;
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpLastRequestedAt = currentDate;
  user.otpRequestsCount! += 1;

  await user.save();
  await sendOTP(email, otp);

  res.status(200).json({ message: "OTP resent successfully" });
};

export const validateOTP = async (
  userId: string,
  enteredOTP: string
): Promise<boolean> => {
  const user = await User.findById(userId);
  //console.log("User:", user);
  if (!user) return false;
  //console.log("User OTP:", user.otp);
  //console.log("Entered OTP:", enteredOTP);
  return Number(user.otp) === Number(enteredOTP);
};
