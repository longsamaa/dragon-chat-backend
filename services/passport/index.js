const passport = require('passport');
const LocalStrategy = require('./local');
const JWTStrategy = require('./jwt');

passport.use(LocalStrategy);
passport.use(JWTStrategy);

module.exports = passport;