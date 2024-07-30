import { Request, Response } from "express";
import Message from "../models/messageModel.js";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { chat, sender, content } = req.body;
    if (!chat || !sender || !content) {
      return res
        .status(400)
        .json({ message: "Chat, sender, and content are required" });
    }
    const message = await Message.create({ chat, sender, content });
    res.status(201).json({ status: "Message sent Successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Error creating message" });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id).populate(
      "sender",
      "firstName lastName"
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error fetching message" });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error updating message" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" });
  }
};

export const getMessagesByChat = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "firstName lastName"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
