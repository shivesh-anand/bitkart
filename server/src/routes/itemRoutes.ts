import { Router } from "express";
import { uploadMiddleware } from "../config/multerConfig.js";
import {
  createItem,
  deleteImage,
  deleteItem,
  getAllItems,
  getItemById,
  getItems,
  updateImages,
  updateItem,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/all", getAllItems);
router.use(authMiddleware);
router.route("/").post(uploadMiddleware, createItem).get(getItems);

router.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);
router.patch("/:id/images", uploadMiddleware, updateImages);
router.delete("/:itemId/images/:imageId", deleteImage);

export default router;
