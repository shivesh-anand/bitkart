import express from "express";
import {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessagesByChat,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/create", createMessage);
router.route("/:id").get(getMessage).put(updateMessage).delete(deleteMessage);
router.get("/:chatId/messages", getMessagesByChat);

export default router;
