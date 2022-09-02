const express = require('express');
const router = express.Router();

// import middlewares
const {requireLogin, authMiddleware, adminMiddleware} = require('../controllers/auth');

// import controllers
const {read} = require('../controllers/user');

// routes
router.get('/user', requireLogin, authMiddleware, read);
router.get('/admin', requireLogin, adminMiddleware, read);

module.exports = router;
