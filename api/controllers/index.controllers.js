import { pool } from "../db/db.js";

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
    ...specificData
  } = req.body;

  // Validate required fields
  if (!estadoTiempo || !estacion || !tipoRegistro) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Format date to 'YYYY-MM-DD HH:MM:SS'
  let fechaMysql = null;
  if (fechaCapturaLocal) {
    const fecha = new Date(fechaCapturaLocal);
    fechaMysql = fecha.toISOString().slice(0, 19).replace("T", " ");
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
        ...specificData,
        evidencias: evidencias ? JSON.stringify(evidencias) : null,
      };

      // Dynamically construct the query for the specific subtable
      const keys = Object.keys(subTableData).join(", ");
      const placeholders = Object.keys(subTableData).map(() => "?").join(", ");
      const values = Object.values(subTableData);

      const query = `INSERT INTO ${tipoRegistro} (${keys}) VALUES (${placeholders})`;

      pool.query(query, values, (error) => {
        if (error) {
          console.error(`Database error on ${tipoRegistro}:`, error);
          return res.status(500).json({ message: error.message });
        }

        res.status(201).json({
          msg: "Record created successfully",
          id: registroId,
        });
      });
    }
  );
};