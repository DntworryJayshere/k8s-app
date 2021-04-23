const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		//Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
