const express = require('express');
const usersUtil = require('../util/usersUtil');
const router = express.Router();
const passport = require('passport');
const debug = require('debug')('app:userrouter');

router.post('/signup', (req, res) => {
    const { error } = usersUtil.validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else if (req.body.phone.toString().length < 10) {
        return res.status(400).send('Phone should be of min length 10');
    } else {
        usersUtil.createUser(req)
        .then((result) => {
            res.send('User Craeted Successfully');
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
});

// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', { session: false}, (err, user, info) => {
//         debug(`Error: ${err} and User ${user}`);
//         if (err || !user) {
//             return res.status(400).send(info);
//         }
//         return res.send(user);
//     })
// }, (req, res) => {
//     res.send(req.user);
// });

// router.post('/login', function (req, res) {
//     res.send(req.user);
// });

router.post('/login',
    passport.authenticate('local', { failureMessage: 'Unauthorized User' }),
    function (req, res) {
        res.json(req.user);
    });

router.get('/', (req, res) => {
    usersUtil.findAllUsers()
        .then((result) => {
            res.send(result);
        }).catch(err => res.status(400).send(err))
});

module.exports = router;