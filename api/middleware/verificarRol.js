// Middleware para restringir acceso solo a administradores
export const verificarAdmin = (req, res, next) => {
    // Obtiene el rol del usuario desde el token JWT ya verificado
    const rol = req.usuario_rol;
    
    // Si no es administrador, devuelve error 403 (Forbidden)
    if (rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
    }
    
    // Si es administrador, permite continuar a la siguiente función
    next();
};
