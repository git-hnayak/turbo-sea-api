const debug = require('debug')('app:ensureAuth');
const passport = require('passport');

const auth = (req, res, next) => {
    console.log('Authenticating...');

//     passport.authenticate('local', {session: false}, (err, user, info) => {
//         debug(`Error: ${err} and User ${user}`);
//         if (err || !user) {
//             return next(info);
//         }
//     //    req.login(user, {session: false}, (err) => {
//     //        if (err) {
//     //            res.send(err);
//     //        }
//     //        // generate a signed son web token with the contents of user object and return it in the response
//     //        const token = jwt.sign(user, 'your_jwt_secret');
//     //        return res.json({user, token});
//     //     });
//     return next({user});

// });

if (req.isAuthenticated()){
    debug('Authenticated user is ' + req.user.phone);
    return next();
} else {
    debug('User is not authenticated!');
    res.send('/#/sign-in');
}
}

module.exports = auth;