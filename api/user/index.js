const express = require('express');
const router = express.Router();
const controller = require('./controller');
const passport = require('../../services/passport');
/* GET users listing. */
router.post('/',controller.addUser);
router.post('/login',passport.authenticate('local', {session : false}),controller.login);
router.post('/registration',controller.registration);
router.post('/GoogleLogin',controller.GoogleLogin);
router.get('/profile',passport.authenticate('jwt',{session : false}),controller.getProfile);

module.exports = router;
