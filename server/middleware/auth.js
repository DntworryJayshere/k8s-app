const User = require('../models/user');
const Link = require('../models/link');
const expressJwt = require('express-jwt');
const _ = require('lodash');

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET }); // req.user

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.user._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id;
	User.findOne({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}

		if (user.role !== 'admin') {
			return res.status(400).json({
				error: 'Admin resource. Access denied',
			});
		}

		req.profile = user;
		next();
	});
};

exports.canUpdateDeleteLink = (req, res, next) => {
	const { id } = req.params;
	Link.findOne({ _id: id }).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: 'Could not find link',
			});
		}
		let authorizedUser =
			data.postedBy._id.toString() === req.user._id.toString();
		if (!authorizedUser) {
			return res.status(400).json({
				error: 'You are not authorized',
			});
		}
		next();
	});
};
