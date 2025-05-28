import { Router } from "express";
import { getRegistros, getUsuarios, getBiomas, getAnteproyectos, getEcorangers, createRecord } from "../controllers/index.controllers.js";
import upload from "../middleware/multerConfig.js";
//import { verificarToken } from "../middleware/token.js";

const router = Router();

router.get("/registros", getRegistros);
router.get("/usuarios", getUsuarios);
router.get("/anteproyectos", getAnteproyectos);
router.get("/biomas", getBiomas);
router.get("/ecorangers", getEcorangers);
router.post("/records",upload.array("images", 5), createRecord);


export default router;