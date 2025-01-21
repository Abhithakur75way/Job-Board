import multer from "multer";
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  /**
   * Specify the destination folder for uploaded resumes.
   * @param {Request} req - Express request object
   * @param {File} file - Multer file object
   * @param {Function} cb - Callback function
   * @param {string} cb(null, "uploads/resumes") - Pass the destination folder path to the callback
   */
  destination: function (req: any, file: Express.Multer.File, cb: Function) {
    cb(null, "uploads/resumes");
  },
/**
 * Generate a unique filename for the uploaded file by appending a timestamp 
 * to the original file's extension.
 * 
 * @param {Request} req - Express request object
 * @param {Express.Multer.File} file - Multer file object containing file details
 * @param {Function} cb - Callback function to pass the generated filename
 */

  filename: function (req: any, file: Express.Multer.File, cb: Function) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer to handle file uploads
export const uploadResume = multer({ storage: storage });
