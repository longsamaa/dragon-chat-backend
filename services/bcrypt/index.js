const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALTROUNDS);
const myPassword = '$2b$10$8yIdhLZ6mi0Vc4TbLXaHyOEiCbyf7pzoCztsCsjvKfEz5lMRSHP1W';
module.exports.hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}
module.exports.checkPassword = (password,hashPassword) => {
    return bcrypt.compareSync(password,hashPassword);
}
