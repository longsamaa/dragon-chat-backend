const validation = require('../../validation');
const model = require('./model');
const bcrypt = require('../../services/bcrypt');
const googleVerify = require('../../services/google-auth');
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
    const token = req.body.token;
    googleVerify(token)
        .then(async (data) => {
            const emailExists = await validation.checkEmailExists(data.getPayload().email);
            if(emailExists){
                console.log(emailExists);
                res.status(409).send('Email exists');
            }else{
                const payload = data.getPayload();
                await model.addDataGoogle(payload)
                    .then(async (result) => {
                        const newUser = {
                            nickname: payload.given_name,
                            email : 'ntlong281098@gmail.com',
                            imageURL : payload.picture,
                            googleData : result._id
                        };
                        await model.addUserGoogle(newUser)
                            .then(result => {
                                res.status(200).send('Sign In success');
                            })
                            .catch(async (err) => {
                                await model.deleteDataGoogleError(result._id);
                                res.status(507).send('Create failed');
                            })
                    })
                    .catch(err => res.status(507).send('Create failed'))
            }
        })
        .catch(err => {
        if(err){
            res.status(401).send('Authorize');
        }
    });
}