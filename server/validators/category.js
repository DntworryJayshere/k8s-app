const { check } = require('express-validator');

exports.categoryCreateValidator = [
	check('name', 'Name is required').not().isEmpty(),
	check('image', 'Image is required').not().isEmpty(),
	check(
		'content',
		'Content is required and should be at least 20 characters long'
	).isLength({ min: 20 }),
];

exports.categoryUpdateValidator = [
	check('name', 'Name is required').not().isEmpty(),
	check('content', 'Content is required').isLength({ min: 20 }),
];
