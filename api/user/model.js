const jwt = require('jsonwebtoken');
const User = require('./userSchema');
module.exports.details = (id) => {
    const user = [{id : 1, name : 'x'}];
    return user.find(u => u.id === parseInt(id));
}
module.exports.addUser = async (user) => {
    const newUser = new User({
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        hashPassword: user.hashPassword
    });
    return await newUser.save()
        .then(result => {
            return result;
        })
        .catch(err => console.log(err));
}
module.exports.createJwtToken = (user) => {
    return jwt.sign(user,process.env.JWT_SECRET_KEY);
}
module.exports.addUserLoginWithGoogle = async (user) =>{
    const newUser = new User({
        nickname: user.nickname,
        email : user.email,
        googleId : user.googleId,
        imageURL : user.imageURL
    });
    return await newUser.save()
        .then(result => {
            return result;
        })
        .catch(err => console.log(err));
}
module.exports.findGoogleId =  (googleId) => {
    return User.findOne({googleId : googleId})
        .exec()
        .then(result => {
            return result;
        })
        .catch(err => console.log(err));
}