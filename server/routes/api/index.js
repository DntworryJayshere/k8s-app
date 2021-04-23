// const path = require('path');
const router = require('express').Router();

//Define Routes
router.use('/auth', require('./auth'));
router.use('/category', require('./category'));
router.use('/link', require('./link'));
router.use('/user', require('./user'));

// For anything else, render the html page THIS WILL CAUSE ISSUE NOW
// router.use(function (req, res) {
// 	res.sendFile(path.join(__dirname, '../../client/public/index.html'));
// });

module.exports = router;
