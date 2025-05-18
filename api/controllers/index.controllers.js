import { pool } from "../db/db.js";
import upload from "../middleware/multerConfig.js";
import path from "path"; // For ES module compatibility

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