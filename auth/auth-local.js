const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../model/users');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:passportlocal')

passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password'
}, (phone, password, done) => {

    debug('auth-local-strategy phone: ', phone);
    debug('auth-local-strategy pwd: ', password);
    let userVal = {};
    UserModel.findOne({phone})
    .then((result) => {
        if (!result) {
            debug('Error in auth', result);
            return done(null, false, { message: 'Incorrect phone or password.' });
        }
        debug('User from db: ', result);
        userVal = result;
        return bcrypt.compare(password, result.password);
    }).then((bcryptRes) => {
        if (!bcryptRes){
            debug('Incorrect password for ' + phone);
            return done(null, false, { message: 'Incorrect password.' });
        } else {
            return done(null, userVal, { message: 'Logged In Successfully'});
        }
    }).catch((err) => {
        debug('Error while authenticating catch ' + err);
        return done(err, null, { message: 'Error while logging into system'});
    })
}));

