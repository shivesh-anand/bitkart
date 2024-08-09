import mongoose, { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword?: string;
  otp?: string;
  otpExpiresAt?: Date;
  otpRequestsCount?: number;
  otpLastRequestedAt?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    hashedPassword: {
      type: String,
      select: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpRequestsCount: {
      type: Number,
      default: 0,
    },
    otpLastRequestedAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);
export default User;
