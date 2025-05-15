import "dotenv/config";
import express from "express";
import indexRoutes from "./api/routes/index.routes.js";
import { fileURLToPath } from "url"; /* This line imports the `fileURLToPath`
 function from Node.js’s built-in `url` module. In modern JavaScript projects,
  especially those using ES modules (with `import`/`export` syntax), 
  file paths are often represented as file URLs (for example, `file:///C:/path/to/file.js`). 
  // The `fileURLToPath` function is used to convert these file URLs into standard file system 
  // paths that Node.js can work with (like `C:\path\to\file.js` on Windows or `/path/to/file.js` on Unix systems).

    This is particularly useful when you need to determine the actual file path of the current module 
    or when working with file operations that require a traditional path string. 
    By importing `fileURLToPath`, 
    your code can reliably handle file paths in a way that is compatible
    across different operating systems and Node.js environments.*/
import path from "path"; // For ES module compatibility
import cors from "cors"; // For CORS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", indexRoutes);

const port = 4000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));