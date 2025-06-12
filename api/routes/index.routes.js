import { Router } from "express";
import { getRegistros, getUsuarios, getUsuariosPendientes, actualizarEstadoUsuario, getBiomas, getAnteproyectos, getEcorangers, createRecord, createBiomas, autenticacion, postConvocatoria } from "../controllers/user.controllers.js";
import { registerUser } from "../controllers/user.controllers.js";
import { getChatCompletion, uploadChatFile } from "../controllers/chat.controllers.js";
import upload, { chatUpload } from "../middleware/multerConfig.js";
import { verificarToken } from "../middleware/token.js";
import { verificarAdmin } from "../middleware/verificarRol.js";
import { getUser, putNivel } from "../controllers/game.controllers.js";
import { getUsuariosAprobados } from "../controllers/user.controllers.js";
import { updateUsuario } from "../controllers/user.controllers.js";
const router = Router();

// Rutas públicas
router.post("/login", autenticacion);

// Rutas protegidas para todos los usuarios
router.post("/records", verificarToken, upload.array("images", 5), createRecord);
router.get("/biomas", verificarToken, getBiomas);
router.post("/chat/completions", verificarToken, getChatCompletion);
router.post("/chat/upload", verificarToken, chatUpload.single("file"), uploadChatFile);

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
router.get("/game/users/:id", getUser);
router.put("/game/users/:id", putNivel);
router.get("/usuarios/all", verificarToken, getUsuariosAprobados);
router.put("/usuarios/:id", verificarToken, verificarAdmin, updateUsuario);
export default router;