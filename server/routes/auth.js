const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    res.json({
        data: 'you hit register endpoint middleware...'
    });
});

module.exports = router;
