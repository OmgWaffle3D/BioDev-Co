const bcrypt = require('bcrypt');

/** 
 * This method hashes a given password
 * @param {*} pass the users password
 * @returns encrypted password
 */

async function encryptPassword(pass){
    let password = await bcrypt.hash(pass, 8);
    return password;
}

async function isValidUser(username, encryptPassword){
    let query = `SELECT id, name, username, password, age, hash_password FROM users WHERE username = ?`;  
    let params = [username];
    qResult = await dataSource.getDataWithParams(query, params);
    let user = qResult.rows[0];
    if(user){
        let isEqual = await bcrypt.compare(password, user.hash_password);
        if(isEqual){
            return user;
        }
    }
    return null;
}

module.exports = {
    encryptPassword,
    isValidUser
}