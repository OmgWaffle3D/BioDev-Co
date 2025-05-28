import { Router } from "express";
import { getRegistros, getUsuarios, createRecord } from "../controllers/index.controllers.js";
import upload from "../middleware/multerConfig.js";
import {pool} from "../db/db.js"; // Import the database connection pool
//import { verificarToken } from "../middleware/token.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ isLogin: false, error: "Error en el servidor" });
      }
      if (results.length > 0) {
        return res.json({
          isLogin: true,
          user: {
            id: results[0].id,
            name: results[0].nombre,
            correo: results[0].correo
          }
        });
      } else {
        return res.json({ isLogin: false });
      }
    }
  );
});

router.get("/registros", getRegistros);
router.get("/usuarios", getUsuarios);
router.post("/records", upload.array("images", 5), createRecord);

export default router;