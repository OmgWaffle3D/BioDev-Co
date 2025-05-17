const bcrypt = require('bcrypt');

/** 
 * This method hashes a given password
 * @param {*} pass the users password
 * @returns encrypted password
 */

//* @param {*} pass the users password
//* @returns encrypted password

//* This method hashes a given password
async function encryptPassword(pass){
    let password = await bcrypt.hash(pass, 8);
    return password;
}

//* This method checks if the user is valid
//* @param {*} username the users username
//* @param {*} password the users password
//* @returns user object if valid, null otherwise
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

// Export the functions
module.exports = {
    encryptPassword,
    isValidUser
}