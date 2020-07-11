const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const User = require('../../api/user/userSchema')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
module.exports = new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id : jwt_payload._id}, function (err,user) {
        if(err){
            return done(err,false);
        }
        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
});