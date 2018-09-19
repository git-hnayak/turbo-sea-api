const UserModel = require('../model/users');
const debug = require('debug')('app:userUtil');
const debugdb = require('debug')('app:db');
const Joi = require('Joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRound = 12;

const validateUser = (user) => {
    const userSchema = {
        phone: Joi.number().required(),
        password: Joi.string().required().regex(/^[a-zA-Z0-9]{8,30}$/)
    }

    const result = Joi.validate(user, userSchema);
    if (result.error) {
        debug(result.error.details[0].message);
    }
    return result;
}

const findAllUsers = () => {
    return new Promise((resolve, reject) => {
        UserModel.find()
            .limit(10)
            .select({_id: 0, password: 0})
            .then(result => resolve(result))
            .catch((err) => {
                reject(err)
            });
    })
};

const findUserByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        UserModel.find({ phone })
            .select({_id: 0, password: 0})
            .then(result => {
                resolve(result);
            }).catch((err) => {
                reject(err)
            });
    })
}

const checkExistingUser = (phone) => {
    return new Promise((resolve, reject) => {
        findUserByPhone(phone)
        .then((result) => {
            if (result.length > 0) {
                reject('User already exist...');
            } else {
                resolve(result);;
            }
        }).catch((err) => {
            reject(err)
        });
    })
}

const bcryptPassword = (user) => {
    debug('Calling becrypt..');
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, saltRound, (err, hash) => {
            if (err) {
                reject(err)
            } else {
                resolve(hash);
            }
        })
    })
}

const saveNewUser = (user) => {
    const userModelObj = new UserModel(user);
    return new Promise((resolve, reject) => {
        userModelObj.save()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

const createUser = (req) => {
    const user = req.body;
    return new Promise((resolve, reject) => {
        checkExistingUser(user.phone)
        .then((result) => {
            return bcryptPassword(user);
        })
        .then((hash) => {
            user.password = hash;
            debug('Hash pwd: ', user.password);
            return saveNewUser(user);
        })
        .then((res) => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        }) 
    });
}

module.exports = {
    validateUser: validateUser,
    findAllUsers: findAllUsers,
    createUser:  createUser
}