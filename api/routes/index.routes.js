import { Router } from "express";
import { getRegitros } from "../controllers/index.controllers.js";


const router = Router();

router.get("/api", getRegitros); // http://localhost:4000/


export default router;