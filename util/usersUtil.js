const UserModel = require('../model/users');
const debug = require('debug')('app:userUtil');
const debugdb = require('debug')('app:db');
const Joi = require('Joi');
const bcrypt = require('bcrypt');

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
                debug(err);
                reject(err)
            });
    })
};

const findUserByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        UserModel.find({ phone })
            .select({_id: 0, password: 0})
            .then(result => {
                debug(result);
                resolve(result);
            }).catch((err) => {
                debug(err);
                reject(err)
            });
    })
}

const bcryptPassword = (user) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, saltRound, (err, hash) => {
            if (err) {
                reject(err)
            } else {
                resolve(hash);
                // user.password = hash;
                // return saveUser(user);
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
        findUserByPhone(user.phone).then((result) => {
            if (result.length > 0) {
                reject('User already exist...');
            } else {
                bcryptPassword(user);
            }
        })
        .then((hash) => {
            user.password = hash;
            saveNewUser(user)
        }).then((res) => {
            resolve(res);
        }).catch(error => {
            reject(error);
        }) 
    });
}

module.exports = {
    validateUser: validateUser,
    findAllUsers: findAllUsers,
    createUser:  createUser
}