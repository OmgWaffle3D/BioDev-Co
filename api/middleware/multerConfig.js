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

// Create a more flexible upload configuration for chat files
const chatUpload = multer({
    storage: storage, // Use the same storage as regular uploads
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for chat files
    fileFilter: (req, file, cb) => {
        // Allow images, documents, and text files
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|csv|xlsx|xls/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetypes = /image\/.*|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/.*|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/;
        const mimetype = mimetypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("File type not allowed. Allowed types: images, PDF, Word docs, text files, Excel sheets"));
    },
});

export default upload;
export { chatUpload };