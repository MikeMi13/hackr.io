const express = require('express');
const router = express.Router();

// import validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators/index');

// controllers
const { requireLogin, authMiddleware, adminMiddleware, canUpdateDeleteLink } = require('../controllers/auth');
const { create, list, read, update, remove, clickCount, popular, popularInCategory } = require('../controllers/link');

// routes (for CRUD)
router.post('/link', requireLogin, authMiddleware, linkCreateValidator, runValidation, create);
router.post('/links', requireLogin, adminMiddleware, list);
router.put('/click-count', clickCount);
router.get('/link/popular', popular);
router.get('/link/popular/:slug', popularInCategory);
router.get('/link/:id', read);
router.put('/link/:id', requireLogin, authMiddleware, canUpdateDeleteLink, linkUpdateValidator, runValidation, update);
router.put('/link/admin/:id', requireLogin, adminMiddleware, linkUpdateValidator, runValidation, update);
router.delete('/link/:id', requireLogin, authMiddleware, canUpdateDeleteLink, remove);
router.delete('/link/admin/:id', requireLogin, adminMiddleware, remove);

module.exports = router;
