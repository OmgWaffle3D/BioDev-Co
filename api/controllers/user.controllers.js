import { pool } from "../db/db.js";
import upload from "../middleware/multerConfig.js";
import path from "path"; // For ES module compatibility
import jwt from 'jsonwebtoken';

// GET all registros
export const getRegistros = (req, res) => {
  pool.query("SELECT * FROM registros", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

// GET all usuarios
export const getUsuarios = (req, res) => {
  pool.query("SELECT * FROM usuarios", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

export const getAnteproyectos = (req, res) => {
  pool.query("SELECT * FROM anteproyectos", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

export const getBiomas = (req, res) => {
  pool.query("SELECT * FROM biomas", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

export const getEcorangers = (req, res) => {
  pool.query("SELECT * FROM ecorangers", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

// Post de usuarios
export const registerUser = (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    contrasena,
    telefono,
    pais,
    provincia,
    ciudad,
    organizacion,
    descripcion
  } = req.body;

  // Guarda la ruta del archivo si se subió una foto
  const foto_perfil = req.file ? `/uploads/${req.file.filename}` : null;

  // Valida los campos requeridos aquí si lo deseas

  pool.query(
    `INSERT INTO usuarios 
      (nombre, apellido, correo, contrasena, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, correo, contrasena, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ msg: "Usuario registrado", id: results.insertId });
    }
  );
};

// Combined POST for ecological data and images
export const createRecord = (req, res) => {
  const {
    estadoTiempo,
    estacion,
    tipoRegistro,
    usuario_id = 1,
    reporteIdLocal,
    fechaCapturaLocal,
    evidencias,
    images, // Explicitly capture to exclude it
    ...specificData
  } = req.body;

  // Validate required fields
  if (!estadoTiempo || !estacion || !tipoRegistro) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate tipoRegistro against allowed values
  const validRegistros = [
    "fauna_transecto",
    "fauna_punto_conteo",
    "fauna_busqueda_libre",
    "validacion_cobertura",
    "parcela_vegetacion",
    "camaras_trampa",
    "variables_climaticas",
  ];
  if (!validRegistros.includes(tipoRegistro)) {
    return res.status(400).json({ message: "Invalid tipoRegistro" });
  }

  // Format date to 'YYYY-MM-DD HH:MM:SS'
  let fechaMysql = null;
  if (fechaCapturaLocal) {
    const fecha = new Date(fechaCapturaLocal);
    if (isNaN(fecha)) {
      return res.status(400).json({ message: "Invalid fechaCapturaLocal" });
    }
    fechaMysql = fecha.toISOString().slice(0, 19).replace("T", " ");
  }

  // fecha de instalación para 'camaras_trampa' DATETIME
  let fechaInstalacionMysql = null;
if (tipoRegistro === "camaras_trampa" && specificData.fechaInstalacion) {
  const fechaInst = new Date(specificData.fechaInstalacion);
  if (isNaN(fechaInst)) {
    return res.status(400).json({ message: "Invalid fechaInstalacion" });
  }
  fechaInstalacionMysql = fechaInst.toISOString().slice(0, 19).replace("T", " ");
  specificData.fechaInstalacion = fechaInstalacionMysql; // Sobrescribe el valor original
}

// Quitar campos innecesarios para tablas que no los usan
if (tipoRegistro !== "camaras_trampa") {
  delete specificData.fechaInstalacion;
}

// Asegurar que listaChequeo se guarde como JSON string si existe
if (specificData.listaChequeo) {
  specificData.listaChequeo = JSON.stringify(specificData.listaChequeo);
}


  // Insert into the main 'registros' table
  pool.query(
    "INSERT INTO registros (usuario_id, estadoTiempo, estacion, tipoRegistro, reporteIdLocal, fechaCapturaLocal) VALUES (?, ?, ?, ?, ?, ?)",
    [usuario_id, estadoTiempo, estacion, tipoRegistro, reporteIdLocal, fechaMysql],
    (error, results) => {
      if (error) {
        console.error("Database error on registros:", error);
        return res.status(500).json({ message: error.message });
      }

      const registroId = results.insertId;

      // Prepare data for the specific subtable, including evidences as JSON
      const subTableData = {
        id: registroId,
        usuario_id,
        ...specificData,
        evidencias: evidencias ? JSON.stringify(evidencias) : null,
      };

      // Dynamically construct the query for the specific subtable
      const keys = Object.keys(subTableData).join(", ");
      const placeholders = Object.keys(subTableData).map(() => "?").join(", ");
      const values = Object.values(subTableData);

      const query = `INSERT INTO ${tipoRegistro} (${keys}) VALUES (${placeholders})`;

      // Insert into the specific subtable
      pool.query(query, values, (error) => {
        if (error) {
          console.error(`Database error on ${tipoRegistro}:`, error);
          return res.status(500).json({ message: error.message });
        }

        // Handle file uploads (store in evidencias table)
        if (req.files && req.files.length > 0) {
          const fileInserts = req.files.map((file) => [
            registroId,
            file.path,
            Math.round(file.size / 1024), // Convert bytes to KB
          ]);

          pool.query(
            "INSERT INTO evidencias (registro_id, file_path, file_size_kb) VALUES ?",
            [fileInserts],
            (error) => {
              if (error) {
                console.error("Database error on evidencias:", error);
                return res.status(500).json({ message: error.message });
              }

              res.status(201).json({
                msg: "Record created successfully",
                id: registroId,
              });
            }
          );
        } else {
          res.status(201).json({
            msg: "Record created successfully",
            id: registroId,
          });
        }
      });
    }
  );
};

// ...existing code...

export const createBiomas = (req, res) => {
  const {
    codigo_bioma,
    region,
    fecha_inicio,
    fase_actual,
    comunidad_vinculada,
    indicador_avance,
    ultima_actividad,
  } = req.body;

  // Validate required fields
// Validate required fields
if (
  !codigo_bioma ||
  !region ||
  !fecha_inicio ||
  !fase_actual ||
  !comunidad_vinculada ||
  indicador_avance === undefined ||
  indicador_avance === null ||
  indicador_avance === "" ||
  !ultima_actividad
) {
  return res.status(400).json({ message: "Missing required fields" });
}

  // Validate fase_actual
  const validFases = ["Validación", "Desarrollo", "Implementación"];
  if (!validFases.includes(fase_actual)) {
    return res.status(400).json({ message: "Invalid fase_actual" });
  }

  // Validate indicador_avance
  const avance = parseFloat(indicador_avance);
  if (isNaN(avance) || avance < 0 || avance > 100) {
    return res.status(400).json({ message: "indicador_avance must be between 0 and 100" });
  }

  // Insert into the biomas table
  pool.query(
    `INSERT INTO biomas 
      (codigo_bioma, region, fecha_inicio, fase_actual, comunidad_vinculada, indicador_avance, ultima_actividad)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      codigo_bioma,
      region,
      fecha_inicio,
      fase_actual,
      comunidad_vinculada,
      indicador_avance,
      ultima_actividad,
    ],
    (error, results) => {
      if (error) {
        console.error("Database error on biomas:", error);
        return res.status(500).json({ message: error.message });
      }
      res.status(201).json({
        msg: "Bioma created successfully",
        id: results.insertId,
      });
    }
  );
}

export const autenticacion = (req, res) => {
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
        // Generar token JWT
        const token = jwt.sign(
          { 
            id: results[0].id,
            correo: results[0].correo,
            rol: results[0].rol 
          },
          process.env.JWT_SECRET,
          { expiresIn: '3h' }
        );

        return res.json({
          isLogin: true,
          token: token,
          user: {
            id: results[0].id,
            name: results[0].nombre,
            correo: results[0].correo,
            rol: results[0].rol
          }
        });
      } else {
        return res.json({ isLogin: false });
      }
    }
  );
};