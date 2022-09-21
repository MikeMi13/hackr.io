const Link = require('../models/link');
const slugify = require('slugify');

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
