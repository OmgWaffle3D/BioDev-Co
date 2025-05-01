import "dotenv/config";
import express from "express";
import indexRoutes from "..//BioDev-Co/api/routes/index.routes.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", indexRoutes);

const port = 4000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));