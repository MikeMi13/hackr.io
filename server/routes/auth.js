const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth');
const { runValidation } = require('../validators/index');

// import from controllers
const { register, registerActivate, login, requireLogin } = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator, runValidation, login);

// router.get('/secret', requireLogin, (req, res) => {
//     res.json({
//         data: 'this is secret page for logged in users only'
//     });
// });

module.exports = router;
