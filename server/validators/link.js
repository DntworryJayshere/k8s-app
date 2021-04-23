const { check } = require('express-validator');

exports.linkCreateValidator = [
	check('title', 'Title is required').not().isEmpty(),
	check('shortdescription', 'Short description is required').not().isEmpty(),
	check('description', 'Description is required').not().isEmpty(),
	check('url', 'URL is required').not().isEmpty(),
	check('type', 'Select a type from the dropdown').not().isEmpty(),
	check('categories', 'Select a category').not().isEmpty(),
];

exports.linkUpdateValidator = [
	check('title', 'Title is required').not().isEmpty(),
	check('shortdescription', 'Short description is required').not().isEmpty(),
	check('description', 'Description is required').not().isEmpty(),
	check('url', 'URL is required').not().isEmpty(),
	check('type', 'Select a type from the dropdown').not().isEmpty(),
	check('categories', 'Select a category').not().isEmpty(),
];
