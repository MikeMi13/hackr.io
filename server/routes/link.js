const express = require('express');
const router = express.Router();

// import validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators/index');

// controllers
const { requireLogin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { create, list, read, update, remove, clickCount } = require('../controllers/link');

// routes (for CRUD)
router.post('/link', requireLogin, authMiddleware, linkCreateValidator, runValidation, create);
router.post('/links', requireLogin, adminMiddleware, list);
router.put('/click-count', clickCount);
router.get('/link/:id', read);
router.put('/link/:id', requireLogin, authMiddleware, linkUpdateValidator, runValidation, update);
router.delete('/link/:id', requireLogin, authMiddleware, remove);

module.exports = router;
