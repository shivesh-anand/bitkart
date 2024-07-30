import express from "express";
import {
  createChat,
  getChat,
  deleteChat,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/create", createChat);
router.route("/:id").get(getChat).delete(deleteChat);
// router.get("/user/chats", getChatsByUser);

export default router;
