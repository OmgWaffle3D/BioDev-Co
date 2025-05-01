import { Router } from "express";
import { getRegitros, getUsuarios, createRecord } from "../controllers/index.controllers.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

router.get("/registros", getRegitros);
router.get("/usuarios", getUsuarios);
router.post("/records", upload.array("images", 5), createRecord); // Handle both data and images

export default router;