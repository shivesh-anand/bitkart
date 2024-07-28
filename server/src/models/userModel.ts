import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword?: string;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
