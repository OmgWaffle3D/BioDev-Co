import { pool } from "../db/db.js";
import upload from "../middleware/multerConfig.js";
import path from "path"; // For ES module compatibility
import jwt from 'jsonwebtoken';
import { getSalt, hashPassword, verifyPassword } from "../utils/hash.js";

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

// user.controllers.js
export const getUsuariosAprobados = (req, res) => {
  pool.query("SELECT * FROM usuarios WHERE estado = 'aprobado'", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};

export const getUsuariosPendientes = (req, res) => {
  pool.query(
    "SELECT * FROM usuarios WHERE estado = 'pendiente'",
    (error, results) => {
      if (error) return res.status(500).json({ message: error.message });
      res.status(200).json({ msg: "OK", data: results });
    }
  );
};


export const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { correo, telefono, rol, pais, provincia, ciudad, organizacion, descripcion } = req.body;
  pool.query(
    `UPDATE usuarios SET correo=?, telefono=?, rol=?, pais=?, provincia=?, ciudad=?, organizacion=?, descripcion=? WHERE id=?`,
    [correo, telefono, rol, pais, provincia, ciudad, organizacion, descripcion, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ msg: "Usuario actualizado" });
    }
  );
};

export const deleteUsuario = (req, res) => {
  const { id } = req.params;
  pool.query(
    "DELETE FROM usuarios WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ msg: "Usuario eliminado" });
    }
  );
};

export const getAnteproyectos = (req, res) => {
  pool.query("SELECT a.*, c.fecha FROM anteproyectos a JOIN convocatorias c ON a.id_convocatoria = c.id_convocatoria;", (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ msg: "OK", data: results });
  });
};


export const postAnteproyecto = (req, res) => {
  const { titulo, descripcion, convocatoria_nombre } = req.body;

  const query = `
    INSERT INTO anteproyectos (titulo, descripcion, id_convocatoria)
    VALUES (?, ?, (SELECT id_convocatoria FROM convocatorias WHERE nombre = ?))
  `;

  pool.execute(query, [titulo, descripcion, convocatoria_nombre], (error, results) => {
    if (error) {
      return res.status(500).json({ msg: "Error al crear anteproyecto", error });
    }

    res.status(201).json({ msg: "Anteproyecto creado con éxito", id: results.insertId });
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

  const salt = getSalt();
  const hash = hashPassword(contrasena, salt);
  const hashedPassword = salt + hash;

  const foto_perfil = req.file ? `/uploads/${req.file.filename}` : null;

  // Primer INSERT: Usuarios
  pool.query(
    `INSERT INTO usuarios 
      (nombre, apellido, correo, contrasena, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, correo, hashedPassword, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil, 'pendiente'],
    (err, result1) => {
      if (err) {
        console.error('Error en INSERT usuarios:', err);
        return res.status(500).json({ error: err.message });
      }

      const usuarioId = result1.insertId;

      // Segundo INSERT: niveles_completados
      pool.query(
        `INSERT INTO niveles_completados (nivel, usuario_id, fecha_completado) VALUES (?, ?, NOW())`,
        [0, usuarioId],
        (err2) => {
          if (err2) {
            console.error('Error en INSERT niveles_completados:', err2);
            return res.status(500).json({ error: err2.message });
          }

          // Solo si ambos inserts fueron exitosos, enviamos la respuesta
          res.status(201).json({ msg: "Usuario registrado y nivel inicial creado", id: usuarioId });
        }
      );
    }
  );
};


// Post de usuarios
// export const registerUser = (req, res) => {
//   const {
//     nombre,
//     apellido,
//     correo,
//     contrasena,
//     telefono,
//     pais,
//     provincia,
//     ciudad,
//     organizacion,
//     descripcion
//   } = req.body;
//   const salt = getSalt();
//   const hash = hashPassword(contrasena, salt);
//   const hashedPassword = salt + hash;

//   // Guarda la ruta del archivo si se subió una foto
//   const foto_perfil = req.file ? `/uploads/${req.file.filename}` : null;

//   // Valida los campos requeridos aquí si lo deseas

//   pool.query(
//   `INSERT INTO usuarios 
//     (nombre, apellido, correo, contrasena, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil, estado)
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//   [nombre, apellido, correo, hashedPassword, telefono, pais, provincia, ciudad, organizacion, descripcion, foto_perfil, 'pendiente'],
//   (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json({ msg: "Usuario registrado", id: results.insertId });
//   }
// );

// post de la tabla de juegos con el usuario registrado
// const usuarioId = results.insertId;

// pool.query(
//       `INSERT INTO niveles_completados (nivel, usuario_id, fecha_completada) VALUES (?, ?, NOW())`,
//       [0, usuarioId],
//       (err2) => {
//         if (err2) return res.status(500).json({ error: err2.message });

//         res.status(201).json({ msg: "Usuario registrado", id: usuarioId });
//       }
//   );

// };

export const actualizarEstadoUsuario = (req, res) => {
  const { id, nuevoEstado } = req.body;

  const validStates = ["pendiente", "aprobado", "rechazado"];
  if (!validStates.includes(nuevoEstado)) {
    return res.status(400).json({ message: "Estado no válido" });
  }

  pool.query(
    "UPDATE usuarios SET estado = ? WHERE id = ?",
    [nuevoEstado, id],
    (error, results) => {
      if (error) return res.status(500).json({ message: error.message });
      res.status(200).json({ msg: "Estado actualizado correctamente" });
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
    "SELECT * FROM usuarios WHERE correo = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ isLogin: false, error: "Error en el servidor" });
      }

      if (results.length > 0) {
        const user = results[0];
        
        // Verificar la contraseña hasheada
        if (!verifyPassword(password, user.contrasena)) {
          return res.json({ isLogin: false, reason: 'invalid_credentials' });
        }

        if (user.estado === 'aprobado') {
          // Usuario aprobado → generamos token
          const token = jwt.sign(
            { 
              id: user.id,
              correo: user.correo,
              rol: user.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
          );

          return res.json({
            isLogin: true,
            token: token,
            user: {
              id: user.id,
              name: user.nombre,
              correo: user.correo,
              rol: user.rol,
              pfp: user.foto_perfil ? user.foto_perfil : ''
            }
          });

        } else {
          // Usuario no aprobado → regresamos razón
          return res.json({
            isLogin: false,
            reason: user.estado === 'pendiente' ? 'pending' : 'rejected'
          });
        }

      } else {
        // Usuario no existe
        return res.json({ isLogin: false, reason: 'invalid_credentials' });
      }
    }
  );
};

// postea convocatoria a la base de datos
export const postConvocatoria = (req, res) => {
  const {
    nombre, 
    region,
    organizacion,
    pais,
    descripcion,
    sitio_web,
    fecha
  } = req.body;

  // validar formato de fecha: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: "Formato de fecha inválido. Usa 'YYYY-MM-DD'" });
  }

  pool.execute(
    `INSERT INTO convocatorias 
    (nombre, region, organizacion, pais, descripcion, sitio_web, fecha) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, region, organizacion, pais, descripcion, sitio_web, fecha],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ msg: "Convocatoria insertada", results });
    }
  );
};

export const getConvocatoria = (req, res) => {
  pool.execute('SELECT id_convocatoria, nombre, fecha FROM convocatorias', (error, results) => {
    if (error) {
      res.status(500).json({error: error.message});
      return;
    }
    res.status(200).json(results); 
  });
};
