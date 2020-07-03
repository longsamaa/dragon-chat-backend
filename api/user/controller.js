const validation = require('../../validation');
const model = require('./model');
const bcrypt = require('../../services/bcrypt');
module.exports.registration = async (req , res, next) => {
    const user = req.body.user;
    const checkEmailExists = await validation.checkEmailExists(user.email);
    console.log(checkEmailExists);
    if(validation.validationRegistration(user)){
        if(checkEmailExists) {
            res.status(409).send("Email is exists");
        }
        else
        {
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
module.exports.GoogleLogin =  async (req, res, next) => {
    const user = req.body;
    console.log(user);
    if(validation.validationLoginWithGoogle(user)) {
        const emailExists = await validation.checkEmailExists(user.email);
        if(emailExists) {
            console.log(emailExists);
            res.status(409).send('Email exists');
        }else{
            //create User
            const newData = {
                googleId: user.response.googleId,
                access_Token : user.response.access_Token
            }
            await model.addDataGoogle(newData)
                .then(async (data) => {
                    console.log(data);
                    const newUser = {
                        nickname: user.response.nickname,
                        email: user.email,
                        imageURL : user.response.imageURL,
                        googleData : data._id
                    }
                    await model.addUserGoogle(newUser)
                            .then(data => {
                                if(data){
                                    console.log(newUser.googleData);
                                    res.status(200).send('Tao thanh cong')
                                }
                            })
                            .catch(async (err) => {
                                await model.deleteDataGoogleError(newUser.googleData);
                                res.status(507).send('Create failed')
                            })
                })
                .catch(err => res.status(507).send('Create failed'))
            //---
        }
    }else{
        res.status(400).send('Bad request');
    }
}
module.exports.getProfile = (req, res, next) => {
    res.json(req.user);
}
