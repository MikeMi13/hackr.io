const express = require('express');
const router = express.Router();

// import middlewares
const {requireLogin, authMiddleware, adminMiddleware} = require('../controllers/auth');

// import validators
const {userUpdateValidator} = require('../validators/auth');
const {runValidation} = require('../validators/index')

// import controllers
const {read, update} = require('../controllers/user');

// routes
router.get('/user', requireLogin, authMiddleware, read);
router.get('/admin', requireLogin, adminMiddleware, read);
router.put('/user', requireLogin, authMiddleware, userUpdateValidator, runValidation, update);

module.exports = router;
