// Utilidades para manejar contraseñas con seguridad usando crypto
import crypto from "crypto";

// Genera una sal aleatoria para aumentar la seguridad del hash
export const getSalt = () => {
    // Genera bytes aleatorios y los formatea según el tamaño configurado
    return crypto.randomBytes(24).toString("base64url").substring(0, process.env.SALT_SIZE);
};

// Aplica un hash SHA-512 a una contraseña con una sal específica
export const hashPassword = (text, salt) => {
    const hashing = crypto.createHash("sha512");
    return hashing.update(salt + text).digest("base64url");
};

// Verifica si una contraseña coincide con un hash almacenado
export const verifyPassword = (password, hashedPassword) => {
    // Extrae la sal y el hash del hash almacenado
    const saltSize = parseInt(process.env.SALT_SIZE);
    const salt = hashedPassword.substring(0, saltSize);
    const hash = hashedPassword.substring(saltSize);
    
    // Genera un nuevo hash y lo compara con el almacenado
    const newHash = hashPassword(password, salt);
    return newHash === hash;
};