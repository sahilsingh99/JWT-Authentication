var express = require('express');

var router = express.Router();

var {signup , login , logout} = require('../controllers/auth');

router.get('/signup', (req, res, next) => {
    res.status(200).json({
        message : "this is signup page"
    });
})

router.get('/login', (req, res, next) => {
    res.status(200).json({
        message : "this is login page"
    });
})

router.post('/signup', signup);

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;