const { check } = require('express-validator');

exports.linkCreateValidator = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('Title is required.'),
    check('url')
        .not()
        .isEmpty()
        .withMessage('URL is required.'),
    check('categories')
        .not()
        .isEmpty()
        .withMessage('Please pick at least one category.'),
    check('type')
        .not()
        .isEmpty()
        .withMessage('Please pick at least one type.'),
    check('medium')
        .not()
        .isEmpty()
        .withMessage('Please pick a medium: video/book.')
];

exports.linkUpdateValidator = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('Title is required.'),
    check('url')
        .not()
        .isEmpty()
        .withMessage('URL is required.'),
    check('categories')
        .not()
        .isEmpty()
        .withMessage('Please pick at least one category.'),
    check('type')
        .not()
        .isEmpty()
        .withMessage('Please pick at least one type.'),
    check('medium')
        .not()
        .isEmpty()
        .withMessage('Please pick a medium: video/book.')
];