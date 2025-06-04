export const verificarAdmin = (req, res, next) => {
    // El token ya fue verificado por verificarToken, así que tenemos acceso a la información del usuario
    const rol = req.usuario_rol;
    
    if (rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
    }
    
    next();
};
