const express = require('express');
const router = express.Router();
const { linkPublishedParams } = require('../../helpers/email');
const AWS = require('aws-sdk');

// import models
const Link = require('../../models/link');
const User = require('../../models/user');
const Category = require('../../models/category');

// import validators
const {
	linkCreateValidator,
	linkUpdateValidator,
} = require('../../validators/link');
const { runValidation } = require('../../validators');

// import middleware
const {
	requireSignin,
	authMiddleware,
	adminMiddleware,
	canUpdateDeleteLink,
} = require('../../middleware/auth');

// config AWS SES
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

//@route    POST api/link
//@desc     *Complete&Tested Post to create Link
//@access   Public
router.post(
	'/',
	linkCreateValidator,
	runValidation,
	requireSignin,
	authMiddleware,
	async (req, res) => {
		const {
			title,
			shortdescription,
			description,
			url,
			url2,
			type,
			categories,
		} = req.body;
		// console.table({ title, url, categories, type, medium });
		const slug = url;
		try {
			let link = new Link({
				title,
				shortdescription,
				description,
				url,
				url2,
				type,
				categories,
				slug,
			});
			// posted by user
			link.postedBy = req.user._id;
			// save link
			link.save((err, data) => {
				if (err) {
					return res.status(400).json({
						error: 'Link already exist',
					});
				}
				res.json(data);
				// find all users in the category
				User.find({ categories: { $in: categories } }).exec((err, users) => {
					if (err) {
						throw new Error(err);
					}
					Category.find({ _id: { $in: categories } }).exec((err, result) => {
						data.categories = result;

						for (let i = 0; i < users.length; i++) {
							const params = linkPublishedParams(users[i].email, data);
							const sendEmail = ses.sendEmail(params).promise();

							sendEmail
								.then((success) => {
									console.log('email submitted to SES ', success);
									return;
								})
								.catch((failure) => {
									console.log('error on email submitted to SES  ', failure);
									return;
								});
						}
					});
				});
			});
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    POST api/link/links
//@desc     *Complete&Tested Post to create Links
//@access   ADMIN
router.post('/links', requireSignin, adminMiddleware, async (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 10;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;
	try {
		Link.find({})
			.populate('postedBy', 'name')
			.populate('categories', 'name slug')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.exec((err, data) => {
				if (err) {
					return res.status(400).json({
						error: 'Could not list links',
					});
				}
				res.json(data);
			});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    PUT api/link/click-count
//@desc     *Complete&Tested  Put to update Link click count
//@access   Public
router.put('/click-count', async (req, res) => {
	const { linkId } = req.body;
	try {
		Link.findByIdAndUpdate(
			linkId,
			{ $inc: { clicks: 1 } },
			{ upsert: true, new: true }
		).exec((err, result) => {
			if (err) {
				console.log(err);
				return res.status(400).json({
					error: 'Could not update view count',
				});
			}
			res.json(result);
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/link/popular
//@desc     *Complete&Tested get popular links
//@access   Public
router.get('/popular', async (req, res) => {
	try {
		Link.find()
			.populate('postedBy', 'name')
			.populate('categories', 'name slug')
			.sort({ clicks: -1 })
			.limit(3)
			.exec((err, links) => {
				if (err) {
					return res.status(400).json({
						error: 'Links not found',
					});
				}
				res.json(links);
			});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/link/popular/:slug
//@desc     *Complete&Tested get popular link by slug
//@access   Public
router.get('/popular/:slug', async (req, res) => {
	const { slug } = req.params;
	console.log(slug);
	try {
		Category.findOne({ slug }).exec((err, category) => {
			if (err) {
				return res.status(400).json({
					error: 'Could not load categories',
				});
			}

			Link.find({ categories: category })
				.sort({ clicks: -1 })
				.limit(3)
				.exec((err, links) => {
					if (err) {
						return res.status(400).json({
							error: 'Links not found',
						});
					}
					res.json(links);
				});
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/link/:id
//@desc     *Complete&Tested get Link by id
//@access   Public
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		Link.findOne({ _id: id }).exec((err, data) => {
			if (err) {
				return res.status(400).json({
					error: 'Error finding link',
				});
			}
			res.json(data);
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    PUT api/link/:id
//@desc     *Complete&Tested put to update link by id
//@access   Public
router.put(
	'/:id',
	linkUpdateValidator,
	runValidation,
	requireSignin,
	authMiddleware,
	canUpdateDeleteLink,
	async (req, res) => {
		const { id } = req.params;
		const {
			title,
			shortdescription,
			description,
			url,
			url2,
			type,
			categories,
		} = req.body;
		const updatedLink = {
			title,
			shortdescription,
			description,
			url,
			url2,
			type,
			categories,
		};
		try {
			Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
				(err, updated) => {
					if (err) {
						return res.status(400).json({
							error: 'Error updating the link',
						});
					}
					res.json(updated);
				}
			);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    PUT api/link/admin/:id
//@desc     put for admin to update Link
//@access   Public
router.put(
	'/admin/:id',
	linkUpdateValidator,
	runValidation,
	requireSignin,
	adminMiddleware,
	async (req, res) => {
		const { id } = req.params;
		const {
			title,
			shortdescription,
			description,
			url,
			url2,
			type,
			categories,
		} = req.body;
		const updatedLink = {
			title,
			shortdescription,
			description,
			url,
			url2,
			type,
			categories,
		};
		try {
			Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
				(err, updated) => {
					if (err) {
						return res.status(400).json({
							error: 'Error updating the link',
						});
					}
					res.json(updated);
				}
			);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    DELETE api/link/:id
//@desc     *Complete&Tested  delete Link by id
//@access   Private User
router.delete(
	'/:id',
	requireSignin,
	authMiddleware,
	canUpdateDeleteLink,
	async (req, res) => {
		const { id } = req.params;
		try {
			Link.findOneAndRemove({ _id: id }).exec((err, data) => {
				if (err) {
					return res.status(400).json({
						error: 'Error removing the link',
					});
				}
				res.json({
					message: 'Link removed successfully',
				});
			});
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    DELETE api/link/admin/:id
//@desc     delete link by admin
//@access   Public
router.delete(
	'/admin/:id',
	requireSignin,
	adminMiddleware,
	async (req, res) => {
		const { id } = req.params;
		try {
			Link.findOneAndRemove({ _id: id }).exec((err, data) => {
				if (err) {
					return res.status(400).json({
						error: 'Error removing the link',
					});
				}
				res.json({
					message: 'Link removed successfully',
				});
			});
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
