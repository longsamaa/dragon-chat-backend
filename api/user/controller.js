const validation = require('../../validation');
const model = require('./model');
const bcrypt = require('../../services/bcrypt');
module.exports.registration = async (req , res, next) => {
    const user = req.body.user;
    console.log(user);
    const checkEmailExists = await validation.validationRegistrationCheckExists(user);
    if(validation.validationRegistration(user)){
        if(checkEmailExists.error) {
            res.status(409).send("Email is exists");
        }else{
            const hashPassword = bcrypt.hashPassword(user.password);
            const newUser = {
                nickname: user.nickname,
                email: user.email,
                password: user.password,
                hashPassword: hashPassword
            }
            await model.addUser(newUser).then(data => {
                if(data) {
                    res.status(200).send('create account success');
                }
            })
                .catch(err => res.status(507).send('Create failed'));
            }
    }else{
        res.status(400).send('bad request');
    }
}

module.exports.details = (req ,res , next) => {
    //validation input
    const id = req.params.id;
    const user = model.details(id);
    res.json(user);
}
module.exports.addUser = (req, res, next) => {
    //validation input
    const user = model.addUser(req.body);
    console.log(user);
    res.json(user);
}
module.exports.login = (req, res, next) => {
    const user = req.user;
    console.log(user);
    if(validation.validationLogin(user)) {
        res.json({token : model.createJwtToken(user)});
    }else{
        res.status(400).json({error : 'Bad request'})
    }
}
module.exports.GoogleLogin = async (req, res, next) => {
    const user = req.body;
    if(validation.validationLoginWithGoogle(user)) {
       await model.findGoogleId(user.googleId)
           .then(data => {
               if(data){
                   const User = {id : data._id, email: data.email}
                   res.status(200).json({token : model.createJwtToken(User)});
               }else{
                   console.log('da tao');
                   model.addUserLoginWithGoogle(user).then(data => {
                   if (data) {
                       const User = {id : data._id, email: data.email}
                       res.status(200).json({token : model.createJwtToken((User))});
                   } else {
                       res.status(400).json({error: 'Bad request'});
                   }
               })
               }
           })
    }else{
        res.status(400).json({error : 'Bad request'});
    }
}
module.exports.getProfile = (req, res, next) => {
    res.json(req.user);
}
