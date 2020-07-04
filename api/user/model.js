const jwt = require('jsonwebtoken');
const User = require('./userSchema');
const googleData = require('./googleDataSchema');
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
   return await googleData.deleteOne({_id : idData},(err,result) => {
       if(err) return err;
       return result;
   })
}
module.exports.addDataGoogle = async (data) =>{
    const newData = new googleData({
        iss : data.iss,
        azp : data.azp,
        aud : data.aud,
        sub : data.sub,
        email : data.email,
        email_verified : data.email_verified,
        name : data.name,
        at_hash : data.at_hash,
        picture : data.picture,
        given_name : data.given_name,
        family_name : data.family_name,
        locale : data.local
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
