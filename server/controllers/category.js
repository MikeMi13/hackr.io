const Category = require('../models/category');
const slugify = require('slugify');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const AWS = require('aws-sdk');

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 
});

exports.create = (req, res) => {
    const {name, content, image} = req.body;
    // parse the base64 representation of an image
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const slug = slugify(name);

    // create a new category
    let category = new Category({name, content, slug});

    // upload image to AWS S3
    const params = {
        Bucket: 'learnwebapp',
        Key: `category/${uuidv4()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };

    S3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Upload to S3 failed'
            });
        }
        console.log('AWS UPLOAD RES DATA:', data);
        category.image.url = data.Location;
        category.image.key = data.Key;
        category.postedBy = req.user._id;

        // save category to DB
        category.save((err, success) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: 'Error saving category to DB'
                });
            }
            return res.json(success);
        });
    });
};

// exports.create = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'Image could not be uploaded'
//             });
//         }
//         //console.table({fields, files});
//         const {name, content} = fields;
//         const {image} = files;
//         const slug = slugify(name);

//         // create a new category
//         let category = new Category({name, content, slug});

//         if (image.size > 2000000) {
//             return res.status(400).json({
//                 error: 'Image must be less than 2MB'
//             });
//         }

//         // upload image to AWS S3
//         const params = {
//             Bucket: 'learnwebapp',
//             Key: `category/${uuidv4()}`,
//             Body: fs.readFileSync(image.filepath),
//             ACL: 'public-read',
//             ContentType: 'image/jpg'
//         }

//         S3.upload(params, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).json({
//                     error: 'Upload to S3 failed'
//                 });
//             }
//             console.log('AWS UPLOAD RES DATA:', data);
//             category.image.url = data.Location;
//             category.image.key = data.Key;

//             // save category to DB
//             category.save((err, success) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(400).json({
//                         error: 'Error saving category to DB'
//                     });
//                 }
//                 return res.json(success);
//             });
//         });
//     });    
// };

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories could not be loaded. Please try again later.'
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
