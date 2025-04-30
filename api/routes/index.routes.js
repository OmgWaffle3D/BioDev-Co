import { Router } from "express";
import { getRegitros, getUsuarios } from "../controllers/index.controllers.js";


const router = Router();

router.get("/registros", getRegitros);
router.get("/usuarios", getUsuarios);



export default router;