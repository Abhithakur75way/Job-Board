import multer from "multer";
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: Express.Multer.File, cb: Function) {
    cb(null, "uploads/resumes");
  },
  filename: function (req: any, file: Express.Multer.File, cb: Function) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer to handle file uploads
export const uploadResume = multer({ storage: storage });
