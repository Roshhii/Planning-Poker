const mongoose = require("mongoose");

/*
Connection à la database : mongodb://localhost:27017/db_planning_poker 
On utilisera User (models/user.js) pour les requêtes : const user = await User.findOne({ email: req.body.email });
*/

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};