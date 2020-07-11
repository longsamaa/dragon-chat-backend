const validation = require('../../validation');
const model = require('./model');
const bcrypt = require('../../services/bcrypt');
const googleVerify = require('../../services/google-auth');
const define = require('./define');
const SIGN_SUCCESS = 'Sign In succes';
module.exports.registration = async (req , res, next) => {
    const user = req.body.user;
    const checkEmailExists = await validation.checkEmailExists(user.email);
    if(!validation.validationRegistration(user)){
        return res.status(400).send('bab request'); ;
    }
    if(checkEmailExists){
        return res.status(409).send("Email is exists");
    }

    const hashPassword = bcrypt.hashPassword(user.password);
    const newUser = {
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        hashPassword: hashPassword
    }

    await model.addUser(newUser)
        .then(data => {
            if(data) {
                return res.status(200).send('Create account success');
            }
        })
        .catch(err => {
            return res.status(507).send('Create failed');
        })
}
module.exports.addUser = (req, res, next) => {
    //validation input
    const user = model.addUser(req.body);
    console.log(user);
    res.json(user);
}
const returnResponse = (user) =>{
    const User = {
        _id : user._id,
        email : user.email
    }
    return {
        message : SIGN_SUCCESS,
        data : {
            id : user._id,
            email : user.email,
            External_Type : user.External_Type
        },
        jwt : model.createJwtToken(User)
    }
}
module.exports.login = (req, res, next) => {
    const user = req.user;
    if(validation.validationLogin(user)) {
        res.status(200).json(returnResponse(user));
    }else{
        res.status(400).json('Bad request');
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
                const user = returnResponse(emailExists);
                return res.status(200).json(user);
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
                           const user = returnResponse(result);
                           console.log(user);
                           return res.status(200).json({user});
                        })
                        .catch(async (err) => {
                            await model.deleteDataGoogleError(result._id);
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
module.exports.getProfile = (req,res,next) => {
    const user = {
        isActive : req.user.isActive,
        _id : req.user._id,
        nickname : req.user.nickname,
        email : req.user.email,
        External_Type: req.user.External_Type,
        Create_At : req.user.Create_At
    }
    return res.status(200).json({
        message : 'Get Profile Succes',
        data : user
    })
}