const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../api/user/userSchema');
const bcrypt = require('../bcrypt');
const define = require('../../api/user/define');
module.exports = new LocalStrategy(({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }),
    (username ,password , done) => {
        User.findOne({email : username}, (err, user) => {
            if(err) {
                return done(err);
            }
            if(!user){
                return done(null,false);
            }
            if(user.External_Type == define.EXTERNAL_TYPE_GOOGLE){
                return done(null,false);
            }
            if(!bcrypt.checkPassword(password,user.hashPassword)){
                return done(null,false);
            }
            return done(null, user);
        })
    }
);