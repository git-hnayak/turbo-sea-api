const express = require('express');
const usersUtil = require('../util/usersUtil');
const router = express.Router();
const passport = require('passport');
const debug = require('debug')('app:userrouter');
const puretext = require('puretext');
const Nexmo = require('nexmo');
require('../auth/auth-local');

const nexmo = new Nexmo({
  apiKey: 'b366ea3d',
  apiSecret: '9XMlOTgX7fCkaH65'
});

router.post('/signup', (req, res) => {
    const { error } = usersUtil.validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else if (req.body.phone.toString().length < 10) {
        return res.status(400).send('Phone should be of min length 10');
    } else {
        usersUtil.createUser(req)
        .then((result) => {
            // let text = {
            //     // To Number is the number you will be sending the text to.
            //     toNumber: '+91' + result.phone,
            //     // From number is the number you will buy from your admin dashboard
            //     fromNumber: '+18652705352',
            //     // Text Content
            //     smsBody: 'Hello Welcome To Turbo-Sea!!! Your Turbo-Sea account has been created successfully... Thank You!!! (Sent from Turbo-Sea Team)',
            //     //Sign up for an account to get an API Token
            //     apiToken: 'bkf7l7'
            // };
            // puretext.send(text, function (err, response) {
            //     if (err) {
            //       console.log('there was an error',err)
            //     }
            //     else {
            //       console.log('there was no error',response)
            //     }
            //     res.send('User Craeted Successfully');
            //   })

            let smsDetails = {
                from: 'Turbo-Sea',
                to: 918888897688,
                text: `Hello Welcome To Turbo-Sea!!! Your Turbo-Sea account has been created successfully... Thank You!!! (Sent from Turbo-Sea Team)`
            }
            nexmo.message.sendSms(smsDetails.from, smsDetails.to, smsDetails.text, (error, response) => {
                if(error) {
                //   throw error;
                  console.error(error);
                } else if(response.messages[0].status != '0') {
                  console.error(response);
                //   throw 'Nexmo returned back a non-zero status';
                } else {
                  console.log(response);
                }
                res.send('User Craeted Successfully');
            })
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
    passport.authenticate('local'),
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