import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 25 /* 25 MB*/ },
});

export const uploadMiddleware = upload.array("images", 4);
