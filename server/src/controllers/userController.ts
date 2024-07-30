import { Request, Response } from "express";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import Chat from "../models/chatModel.js";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Updated Successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ seller: req.user?.id });
    res.status(200).json({ message: "Items Fetched Successfully", items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ users: req.user?.id });
    res.status(200).json({ message: "Chats Fetched Successfully", chats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};
