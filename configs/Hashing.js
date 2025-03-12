const bcrypt = require('bcrypt');

async function hashPass(passsword){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passsword, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        return null;
    }
}


module.exports = {hashPass}