import "dotenv/config";
import indexRoutes from "./api/routes/index.routes.js";
import express from "express";

const app = express();
app.use(express.json());
app.use(indexRoutes)
const port = 4000;

app.listen(port, console.log("http://localhost:" + port));