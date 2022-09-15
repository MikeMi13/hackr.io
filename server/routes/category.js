const express = require('express');
const router = express.Router();

// import validators
const { categoryCreateValidator, categoryUpdateValidator } = require('../validators/category');
const { runValidation } = require('../validators/index');

// controllers
const { requireLogin, adminMiddleware } = require('../controllers/auth');
const { create, list, read, update, remove } = require('../controllers/category');

// routes (for CRUD)
router.post('/category', requireLogin, adminMiddleware, categoryCreateValidator, runValidation, create);
router.get('/categories', list);
router.post('/category/:slug', read);
router.put('/category/:slug', requireLogin, adminMiddleware, categoryUpdateValidator, runValidation, update);
router.delete('/category/:slug', requireLogin, adminMiddleware, remove);

module.exports = router;
