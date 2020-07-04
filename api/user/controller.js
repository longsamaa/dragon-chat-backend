const validation = require('../../validation');
const model = require('./model');
const bcrypt = require('../../services/bcrypt');
const googleVerify = require('../../services/google-auth');
const define = require('./define');
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
            if(emailExists) {
                if (emailExists.External_Type === define.EXTERNAL_TYPE_LOCAL) {
                    return res.status(409).send('Existing email cannot log in with google account');
                }
                const user = {
                    _id: emailExists._id,
                    email: emailExists.email,
                }
                return res.status(200).json({
                    message: 'Sign In succes',
                    data: {
                        id: emailExists._id,
                        token: model.createJwtToken(user)
                    }
                });
            }
            const payload = data.getPayload();
            await model.addDataGoogle(payload)
                .then(async (result) => {
                    console.log(result);
                    const newUser = {
                        nickname: payload.given_name,
                        email: payload.email,
                        imageURL: payload.picture,
                        googleData: result._id
                    };
                    await model.addUserGoogle(newUser)
                        .then(result => {
                            const user = {
                                _id: result._id,
                                email: result.email,
                            }
                            return res.status(200).json({
                                    message: 'Sign In succes',
                                    data: {
                                        id: result._id,
                                        token: model.createJwtToken(user)
                                    }
                            });
                        })
                        .catch(async (err) => {
                            await model.deleteDataGoogleError(result._id);
                            console.log(err);
                            return res.status(507).send('Create failed');
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.status(507).send('Create failed')})
        })
        .catch(err => {
        if(err){
            res.status(401).send('Authorize');
        }
    });
}