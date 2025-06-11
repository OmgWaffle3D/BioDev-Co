import { Router } from "express";
import { getRegistros, getUsuarios, getUsuariosPendientes, actualizarEstadoUsuario, getBiomas, getAnteproyectos, getEcorangers, createRecord, createBiomas, autenticacion, postConvocatoria } from "../controllers/user.controllers.js";
import { registerUser } from "../controllers/user.controllers.js";
import { getChatCompletion } from "../controllers/chat.controllers.js";
import upload from "../middleware/multerConfig.js";
import { verificarToken } from "../middleware/token.js";
import { verificarAdmin } from "../middleware/verificarRol.js";

const router = Router();

// Rutas públicas
router.post("/login", autenticacion);

// Rutas protegidas para todos los usuarios
router.post("/records", verificarToken, upload.array("images", 5), createRecord);
router.get("/biomas", verificarToken, getBiomas);
router.post("/chat/completions", verificarToken, getChatCompletion);

// Rutas protegidas solo para administradores
router.get("/registros", verificarToken, verificarAdmin, getRegistros);
router.get("/usuarios", verificarToken, verificarAdmin, getUsuarios);
router.get("/anteproyectos", verificarToken, verificarAdmin, getAnteproyectos);
router.get("/ecorangers", verificarToken, verificarAdmin, getEcorangers);
router.post('/biomas', verificarToken, verificarAdmin, upload.none(), createBiomas);
router.post("/register", upload.single("foto_perfil"), registerUser);
router.get("/usuarios/pendientes", verificarToken, verificarAdmin, getUsuariosPendientes);
router.post("/usuarios/estado", verificarToken, verificarAdmin, actualizarEstadoUsuario);
router.post("/convocatorias", postConvocatoria);
export default router;