const express = require('express');
const router = express.Router();

// import validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators/index');

// controllers
const { requireLogin, authMiddleware } = require('../controllers/auth');
const { create, list, read, update, remove } = require('../controllers/link');

// routes (for CRUD)
router.post('/link', requireLogin, authMiddleware, linkCreateValidator, runValidation, create);
router.get('/links', list);
router.get('/link/:slug', read);
router.put('/link/:slug', requireLogin, authMiddleware, linkUpdateValidator, runValidation, update);
router.delete('/link/:slug', requireLogin, authMiddleware, remove);

module.exports = router;
