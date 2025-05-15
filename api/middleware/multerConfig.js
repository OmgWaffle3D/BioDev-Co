import multer from "multer"; // Importing multer for handling multipart/form-data
import path from "path"; // For ES module compatibility
import { fileURLToPath } from "url"; // For ES module compatibility

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
// This configuration sets the destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // Ensure this directory exists
    },
    // Set the destination for the uploaded files
    // The destination is set to the "uploads" directory within the current directory
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// Create the multer upload instance with the specified storage and file size limit
// The file size limit is set to 2MB (2 * 1024 * 1024 bytes)
// The file filter allows only specific image formats (JPEG, PNG, GIF)
// The file filter checks the file extension and MIME type to ensure only valid image files are accepted
// If the file type is valid, it calls the callback with null (indicating no error)
// If the file type is invalid, it calls the callback with an error message
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit, matching simulator specs
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images (JPEG, PNG, GIF) are allowed"));
    },
});

export default upload;