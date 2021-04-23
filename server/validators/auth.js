const { check } = require('express-validator');

exports.userRegisterValidator = [
	check('name', 'Name is required').not().isEmpty(),
	check('email', 'Must be a valid email address').isEmail(),
	check('password', 'Password must be at least 6 characters long').isLength({
		min: 6,
	}),
	check('categories')
		.isLength({ min: 6 })
		.withMessage('Pick at aleast one category'),
];

exports.userLoginValidator = [
	check('email', 'Must be a valid email address').isEmail(),
	check('password', 'Password must be at least 6 characters long').isLength({
		min: 6,
	}),
];

exports.forgotPasswordValidator = [
	check('email', 'Must be a valid email address').isEmail(),
];

exports.resetPasswordValidator = [
	check('newPassword', 'Password must be at least 6 characters long').isLength({
		min: 6,
	}),
	check('resetPasswordLink', 'Token is required').not().isEmpty(),
];

exports.userUpdateValidator = [
	check('name', 'Name is required').not().isEmpty(),
];
