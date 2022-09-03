const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const {registerEmailParams, forgotPasswordEmailParams} = require('../helpers/email');
const shortId = require('shortid');

// AWS configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const SES = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
    //console.log('REGISTER CONTROLLER', req.body);
    const { name, email, password } = req.body;

    // check if user email already exists
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is already taken.'
            });
        }
        // generate token with username, email, and password
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m'
        });

        // send email
        const params = registerEmailParams(email, token);
        const sendEmailOnRegisterPromise = SES.sendEmail(params).promise();
        sendEmailOnRegisterPromise
            .then(data => {
                console.log('Email submitted to SES:', data);
                res.json({
                    message: `Email has been sent to ${email}. Please follow the instructions to activate your email.`
                });
            })
            .catch(error => {
                console.log('SES email on register error:', error);
                res.json({
                    message: `We could not verify your email. Please try again later.`
                });
            });
    });
};

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    //console.log(token);
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
        if(err) {
            return res.status(401).json({
                error: 'Expired link. Please try again.'
            });
        }
        //console.log(decoded);
        const {name, email, password} = decoded;
        const username = shortId.generate();

        User.findOne({email}).exec((err, user) => {
            if (user) {
                return res.status(401).json({
                    error: 'Email is already taken.'
                });
            }

            // register new user
            const newUser = new User({username, name, email, password});
            newUser.save((err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: 'Error saving user in database. Try again later.'
                    });
                }
                return res.json({
                    message: 'Registration successful. Please login.'
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'No user exists with this email. Please register.'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
        }
        //console.log(user);
        // generate token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        const {_id, name, email, role} = user;
        return res.json({
            token,
            user: {_id, name, email, role}
        });
    });
};

exports.requireLogin = expressjwt({secret: process.env.JWT_SECRET});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id; // made available by expressjwt
    User.findOne({_id: authUserId}).exec((err, user) => {
        if (err || !user) {
            console.log(err);
            return res.status(400).json({
                error: 'User not found.'
            });
        }
        // add new property
        req.profile = user;
        next();
    });
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id; // made available by expressjwt
    User.findOne({_id: adminUserId}).exec((err, user) => {
        if (err || !user) {
            console.log(err);
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.role != 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }
        // add new property
        req.profile = user;
        next();
    });
}

exports.forgotPassword = (req, res) => {
    const {email} = req.body;
    // check if user exists with this email
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'No user exists with this email.'
            });
        }
        // generate token with email
        const token = jwt.sign({name: user.name}, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '15m'
        });
        // send email
        const params = forgotPasswordEmailParams(email, token);
        // populate DB -> user -> resetPasswordLink
        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if (err) {
                return res.status(400).json({
                    error: 'Failed to reset password. Please try again later.'
                });
            }
            const sendEmailPromise = SES.sendEmail(params).promise();
            sendEmailPromise
                .then(data => {
                    console.log('SES reset password success:', data);
                    return res.json({
                        message: `Email has been sent to ${email}. Click on the link to reset your password.`
                    });
                })
                .catch(error => {
                    console.log('SES reset password failed:', error);
                    return res.json({
                        message: 'We could not verify your email. Please try again later.'
                    });
                });
        });
    });
};

exports.resetPassword = (req, res) => {

};
