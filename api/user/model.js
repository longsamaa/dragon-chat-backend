const jwt = require('jsonwebtoken');
const User = require('./userSchema');
const googleData = require('./googleDataSchema');
module.exports.details = (id) => {
    const user = [{id : 1, name : 'x'}];
    return user.find(u => u.id === parseInt(id));
}
module.exports.addUser = async (user) => {
    const newUser = new User({
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        hashPassword: user.hashPassword,
        External_Type : 'Local',
        Create_at : new Date().getTime()
    });
    return await newUser.save()
        .then(result => {
            return result;
        })
        .catch((err) => {
            console.log(err)
            return Promise.reject(err)
        });
}
module.exports.addUserGoogle = async (user) => {
    console.log(user);
    const newUser = new User({
        nickname: user.nickname,
        email: user.email,
        imageURL : user.imageURL,
        googleData : user.googleData,
        External_Type : 'Google',
        Create_at : new Date().getTime()
    });
    return await newUser.save()
        .then(result => {
            return result;
        })
        .catch((err) => {
            console.log(err)
            return Promise.reject(err)
        });
}
module.exports.deleteDataGoogleError = async (idData) => {
    return await googleData.delete({_id : idData})
        .catch(err => Promise.reject(err));
}
module.exports.addDataGoogle = async (data) =>{
    const newData = new googleData({
        googleId : data.googleId,
        access_Token : data.access_Token
    })
    return await newData.save()
        .then(result => {
            return result;
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        })
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