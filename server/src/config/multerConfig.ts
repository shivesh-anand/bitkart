import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images", 4);

export const uploadMiddleware = upload;
