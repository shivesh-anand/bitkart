import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.array("images", 4);
