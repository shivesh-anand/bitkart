import { Router } from "express";
import { uploadMiddleware } from "../config/multerConfig.js";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  getItems,
  updateItem,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/all", getAllItems);
router.use(authMiddleware);
router.route("/").post(uploadMiddleware, createItem).get(getItems);

router.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);

export default router;
