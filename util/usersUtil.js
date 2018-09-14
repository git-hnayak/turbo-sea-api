const UserModel = require('../model/users');
const debug = require('debug')('app:userUtil');
const debugdb = require('debug')('app:db');
const Joi = require('Joi');

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
            .select({_id: 0})
            .then(result => resolve(result))
            .catch((err) => {
                debug(err);
                reject(err)
            });
    })
};

const createUser = (req) => {
    const body = req.body;
    const userModelObj = new UserModel(body);
    return new Promise((resolve, reject) => {
        userModelObj.save()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

module.exports = {
    validateUser: validateUser,
    findAllUsers: findAllUsers,
    createUser:  createUser
}