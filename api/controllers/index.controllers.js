import { pool } from "../db/db.js";

// GET routes (existing)
export const getRegitros = (req, res) => {
  pool.query("SELECT * FROM registros", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

export const getUsuarios = (req, res) => {
  pool.query("SELECT * FROM usuarios", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

// Combined POST for ecological data and images
export const createRecord = (req, res) => {
  const { estadoTiempo, estacion, tipoRegistro, usuario_id = 1, transecto } = req.body;

  // Validate required fields
  if (!estadoTiempo || !estacion || !tipoRegistro || !transecto) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert into registros table
  pool.query(
    "INSERT INTO registros (usuario_id, estadoTiempo, estacion, tipoRegistro) VALUES (?, ?, ?, ?)",
    [usuario_id, estadoTiempo, estacion, tipoRegistro],
    (error, results) => {
      if (error) {
        console.error("Database error on registros:", error);
        return res.status(500).json({ message: error.message });
      }

      const registroId = results.insertId;

      // Insert into specific table (e.g., fauna_transecto)
      const specificData = {
        id: registroId,
        numero: transecto.numero,
        numeroIndividuos: transecto.numeroIndividuos,
        nombreComun: transecto.nombreComun,
        tipoAnimal: transecto.tipoAnimal,
        observacionTipo: transecto.observacionTipo,
      };

      pool.query(
        `INSERT INTO ${tipoRegistro} SET ?`,
        specificData,
        (error) => {
          if (error) {
            console.error("Database error on specific table:", error);
            return res.status(500).json({ message: error.message });
          }

          // Handle images if present
          if (req.files && req.files.length > 0) {
            const values = req.files.map((file) => [
              registroId,
              `/uploads/${file.filename}`,
              Math.round(file.size / 1024),
            ]);

            pool.query(
              "INSERT INTO evidencias (registro_id, file_path, file_size_kb) VALUES ?",
              [values],
              (error) => {
                if (error) {
                  console.error("Database error on evidencias:", error);
                  return res.status(500).json({ message: error.message });
                }
                res.status(201).json({ msg: "Record and images created", id: registroId });
              }
            );
          } else {
            res.status(201).json({ msg: "Record created", id: registroId });
          }
        }
      );
    }
  );
};