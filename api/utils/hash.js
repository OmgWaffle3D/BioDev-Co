import crypto from "crypto";


export const getSalt = () => {
    return crypto.randomBytes(24).toString("base64url").substring(0,process.env.SALT_SIZE);

};

export const hashPassword = (text, salt) => {
    const hashing = crypto.createHash("sha512");
    return hashing.update(salt +text).digest("base64url");
};

export const verifyPassword = (password, hashedPassword) => {
    // Extract salt from the beginning of the hashed password
    const saltSize = parseInt(process.env.SALT_SIZE);
    const salt = hashedPassword.substring(0, saltSize);
    const hash = hashedPassword.substring(saltSize);
    
    // Hash the provided password with the extracted salt
    const newHash = hashPassword(password, salt);
    
    // Compare the hashes
    return newHash === hash;
};