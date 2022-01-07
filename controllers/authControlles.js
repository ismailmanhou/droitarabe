/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

SECRET_KEY =
  '4978983409bc2665e4ea53ba1a6f0da8b58ddde079a4a9068c944993931ba7316235f554a178f0fef708d63c0e52b1606f7e95d61d9003cf2d972691a19f8080';

//handleErrors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' };
    // incorrect username
    if (err.message === 'incorrect username') {
        errors.username = 'that username is not registered';
    }
    // incorrect password
    if (err.message === 'icorrect password') {
        errors.password = 'that password is not registered';
    }
    //duplicate error code
    if (err.code === 11000) {
        errors.username = 'that username is already registered';
        return errors;
    }

    //validation
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            //console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: maxAge,
    });
};
module.exports.register_get = (req, res) => {
    res.render('register');
};
module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.register_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
