const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
			max: 256,
		},
		shortdescription: {
			type: {},
			min: 5,
			max: 50,
			required: true,
		},
		description: {
			type: {},
			min: 5,
			max: 2000000,
			required: true,
		},
		url: {
			type: String,
			trim: true,
			required: true,
			max: 256,
		},
		url2: {
			type: String,
			trim: true,
			max: 256,
		},
		type: {
			type: String,
			required: true,
			default: '',
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
			index: true,
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Category',
				required: true,
			},
		],
		clicks: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;
