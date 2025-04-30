import { Router } from "express";
import { con1 } from "../controllers/index.controllers.js";


const router = Router();

router.get("/", con1); // http://localhost:4000/


export default router;