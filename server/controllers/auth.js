const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const {registerEmailParams} = require('../helpers/email');

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
            expiresIn: '3m'
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