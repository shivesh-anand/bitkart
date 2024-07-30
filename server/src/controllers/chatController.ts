import { Request, Response } from "express";
import Chat from "../models/chatModel.js";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { users } = req.body;
    if (!users || users.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two users are required" });
    }
    if (users[0] === users[1]) {
      return res.status(400).json({ message: "Users must be different" });
    }
    const existingChat = await Chat.findOne({ users });
    console.log(existingChat);
    if (existingChat) {
      return res
        .status(400)
        .json({ message: "Chat already exists", chat: existingChat });
    }
    const chat = await Chat.create({ users });
    res.status(201).json({ message: "Chat created Successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id).populate(
      "users",
      "firstName lastName"
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chats fetched Successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat", error });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chat deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat", error });
  }
};

// export const getChatsByUser = async (req: Request, res: Response) => {
//   try {
//     const chats = await Chat.find({ users: req.user?.id }).populate(
//       "users",
//       "firstName lastName"
//     );
//     res.status(200).json({ message: "Chats fetched Successfully", chats });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user's chats", error });
//   }
// };
