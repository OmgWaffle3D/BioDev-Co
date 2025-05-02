import "dotenv/config";
import express from "express";
import indexRoutes from "../BioDev-Co/api/routes/index.routes.js"; // Change according to your Workspace structure
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

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