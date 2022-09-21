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
    Link.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not load links. Please try again later.'
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {

};

exports.update = (req, res) => {

};

exports.remove = (req, res) => {

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
