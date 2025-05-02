import { Router } from "express";
import { getRegistros, getUsuarios, createRecord } from "../controllers/index.controllers.js";
import upload from "../middleware/multerConfig.js";
//import { verificarToken } from "../middleware/token.js";

const router = Router();

router.get("/registros", getRegistros);
router.get("/usuarios", getUsuarios);
router.post("/records",upload.array("images", 5), createRecord);


export default router;