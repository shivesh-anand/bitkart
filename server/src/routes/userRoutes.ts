import express from "express";
import {
  getUserChats,
  getUserItems,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.get("/chats", getUserChats);
router.get("/items", getUserItems);

export default router;
