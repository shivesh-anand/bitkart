import mongoose, { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  avatar?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
    },
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
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);
export default User;
