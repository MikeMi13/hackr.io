const Link = require('../models/link');
const User = require("../models/user");
const Category = require("../models/category");
const AWS = require('aws-sdk');
const {linkPublishedParams} = require('../helpers/email');

// AWS configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const SES = new AWS.SES({ apiVersion: '2010-12-01' });

exports.create = (req, res) => {
    const {title, url, categories, type, medium} = req.body;
    //console.table({title, url, categories, type, medium});
    const slug = url;
    let link = new Link({title, url, categories, type, medium, slug});
    link.postedBy = req.user._id;

    // save to DB
    link.save((err, data) => {
        if (err) {
            //console.log(err);
            return res.status(400).json({
                error: 'Link already exists!'
            });
        }
        res.json(data);

        // find all users in the category
        User.find({categories: {$in: categories}}).exec((err, users) => {
            if (err) {
                throw new Error(err);
                console.log('Error finding users to send email to on link publish');
            }
            Category.find({_id: {$in: categories}}).exec((err, result) => {
                data.categories = result;

                for (let i = 0; i < users.length; i++) {
                    const params = linkPublishedParams(users[i].email, data);
                    const sendEmail = SES.sendEmail(params).promise();

                    sendEmail
                        .then(success => {
                            console.log('Email submitted to SES', success);
                            return;
                        })
                        .catch(failure => {
                            console.log('Email failed to submit to SES', failure);
                            return;
                        });

                }
            });
        });
    });
};

exports.list = (req, res) => {
    let _limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let _skip = req.body.skip ? parseInt(req.body.skip) : 0;

    Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({createdAt: -1})
    .skip(_skip)
    .limit(_limit)
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not list links. Please try again later.'
            });
        }
        return res.json(data);
    });
};

exports.read = (req, res) => {
    const {id} = req.params;
    Link.findOne({_id: id}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error finding link.'
            });
        }

        return res.json(data);
    })
};

exports.update = (req, res) => {
    const {id} = req.params;
    const {title, url, categories, type, medium} = req.body;

    Link.findOneAndUpdate({_id: id}, {title, url, categories, type, medium}, {new: true}).exec((err, updated) => {
        if (err) {
            return res.status(400).json({
                error: 'Error updating link.'
            });
        }

        return res.json(updated);
    })
};

exports.remove = (req, res) => {
    const {id} = req.params;
    Link.findOneAndRemove({_id: id}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error removing link.'
            });
        }
        return res.json({
            message: 'Link removed successfully.'
        });
    });
};

exports.clickCount = (req, res) => {
    const {linkId} = req.body;
    Link.findByIdAndUpdate(linkId, {$inc: {clicks: 1}}, {new: true}).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not update view count'
            });
        }
        return res.json(result);
    })
};

exports.popular = (req, res) => {
    Link.find()
        .populate('postedBy', 'name')
        .sort({clicks: -1})
        .limit(3)
        .exec((err, links) => {
            if (err) {
                return res.status(400).json({
                    error: 'Links not found.'
                });
            }
            return res.json(links);
        });
};

exports.popularInCategory = (req, res) => {
    const {slug} = req.params;
    Category.findOne({slug}).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not load category.'
            });
        }

        Link.find({categories: category})
            .sort({clicks: -1})
            .limit(3)
            .exec((err, links) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Links not found.'
                    });
                }
                return res.json(links);
            });
    })
};
