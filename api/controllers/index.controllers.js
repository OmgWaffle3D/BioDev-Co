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

// POST ecological data
export const createRecord = (req, res) => {
  const { estadoTiempo, estacion, tipoRegistro, usuario_id = 1, transecto } = req.body;
  if (!estadoTiempo || !estacion || !tipoRegistro || !transecto) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  pool.query(
    "INSERT INTO registros (usuario_id, estadoTiempo, estacion, tipoRegistro) VALUES (?, ?, ?, ?)",
    [usuario_id, estadoTiempo, estacion, tipoRegistro],
    (error, results) => {
      if (error) return res.status(500).json({ message: error.message });
      const registroId = results.insertId;

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
          if (error) return res.status(500).json({ message: error.message });
          res.status(201).json({ msg: "Record created", id: registroId });
        }
      );
    }
  );
};

// POST image uploads
export const uploadImages = (req, res) => {
  const registroId = req.body.registro_id;
  if (!registroId) return res.status(400).json({ message: "registro_id is required" });

  pool.query(
    "SELECT COUNT(*) as count FROM evidencias WHERE registro_id = ?",
    [registroId],
    (error, results) => {
      if (error) return res.status(500).json({ message: error.message });
      const currentCount = results[0].count;
      const newImagesCount = req.files.length;
      if (currentCount + newImagesCount > 5) {
        return res.status(400).json({ message: "Maximum 5 images allowed" });
      }

      const values = req.files.map((file) => [
        registroId,
        `/uploads/${file.filename}`,
        Math.round(file.size / 1024),
      ]);

      pool.query(
        "INSERT INTO evidencias (registro_id, file_path, file_size_kb) VALUES ?",
        [values],
        (error) => {
          if (error) return res.status(500).json({ message: error.message });
          res.status(200).json({ msg: "Images uploaded" });
        }
      );
    }
  );
};