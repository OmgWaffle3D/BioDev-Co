import { Router } from "express";
import { getRegitros, getUsuarios, createRecord, uploadImages } from "../controllers/index.controllers.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

router.get("/registros", getRegitros);
router.get("/usuarios", getUsuarios);
router.post("/records", createRecord);
router.post("/upload", upload.array("images", 5), uploadImages);

export default router;