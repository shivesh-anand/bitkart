import mongoose, { Document, model, Schema } from "mongoose";

export interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const ChatSchema = new Schema<IChat>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Users are required"],
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", ChatSchema);
export default Chat;
