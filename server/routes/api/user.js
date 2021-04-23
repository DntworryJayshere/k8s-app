const express = require('express');
const router = express.Router();

// import models
const User = require('../../models/user');
const Link = require('../../models/link');

// import validator
const { userUpdateValidator } = require('../../validators/auth');
const { runValidation } = require('../../validators');

// import middleware
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
} = require('../../middleware/auth');

//@route    GET api/user
//@desc     get user
//@access   Private
router.get('/', requireSignin, authMiddleware, async (req, res) => {
	try {
		User.findOne({ _id: req.user._id }).exec((err, user) => {
			if (err) {
				return res.status(400).json({
					error: 'User not found',
				});
			}
			Link.find({ postedBy: user })
				.populate('categories', 'name slug')
				.populate('postedBy', 'name')
				.sort({ createdAt: -1 })
				.exec((err, links) => {
					if (err) {
						return res.status(400).json({
							error: 'Could not find links',
						});
					}
					user.hashed_password = undefined;
					user.salt = undefined;
					res.json({ user, links });
				});
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//@route    GET api/user/admin
//@desc     get admin user
//@access   Admin
router.get('/admin', requireSignin, adminMiddleware, async (req, res) => {
	try {
		User.findOne({ _id: req.user._id }).exec((err, user) => {
			if (err) {
				return res.status(400).json({
					error: 'User not found',
				});
			}
			Link.find({ postedBy: user })
				.populate('categories', 'name slug')
				.populate('postedBy', 'name')
				.sort({ createdAt: -1 })
				.exec((err, links) => {
					if (err) {
						return res.status(400).json({
							error: 'Could not find links',
						});
					}
					user.hashed_password = undefined;
					user.salt = undefined;
					res.json({ user, links });
				});
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//@route    PUT api/user
//@desc     update user
//@access   Private
router.put(
	'/',
	userUpdateValidator,
	requireSignin,
	authMiddleware,
	runValidation,
	async (req, res) => {
		const { name, password } = req.body;
		try {
			switch (true) {
				case password && password.length < 6:
					return res
						.status(400)
						.json({ error: 'Password must be at least 6 characters long' });
					break;
			}

			User.findOneAndUpdate(
				{ _id: req.user._id },
				{ name, password },
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.staus(400).json({
						error: 'Could not find user to update',
					});
				}
				updated.hashed_password = undefined;
				updated.salt = undefined;
				res.json(updated);
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
