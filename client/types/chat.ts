export interface IUser {
  _id: string;
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

export interface IChat {
  _id: string;
  users: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
