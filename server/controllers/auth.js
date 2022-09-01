const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const {registerEmailParams} = require('../helpers/email');
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
