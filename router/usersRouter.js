const express = require('express');
const usersUtil = require('../util/usersUtil');
const router = express.Router();

router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
    usersUtil.findAllUsers()
        .then((result) => {
            res.send(result);
        }).catch(err => res.status(400).send(err))
});

module.exports = router;