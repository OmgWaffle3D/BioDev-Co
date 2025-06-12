import jwt from "jsonwebtoken";  // Importa la librería para manejar tokens

// Middleware para verificar la autenticidad del token
export const verificarToken = (req, res, next) => {
  // Busca el encabezado de autorización en la petición
  const authHeader = req.headers.authorization;

  // Si no hay encabezado o no tiene formato "Bearer [token]", rechaza la petición
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // Extrae el token del encabezado (elimina la palabra "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verifica si el token es válido usando la clave secreta del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guarda el ID y rol del usuario en el objeto request para uso posterior
    req.usuario_id = decoded.id;
    req.usuario_rol = decoded.rol;
    
    // Permite que la petición continúe a la siguiente función
    next();
  } catch (err) {
    // Si el token es inválido o ha expirado, rechaza la petición
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};