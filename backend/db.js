const mongoose = require("mongoose");


//Connection à la database : mongodb://localhost:27017/db_planning_poker 
//On utilisera User (models/user.js) pour les requêtes : const user = await User.findOne({ email: req.body.email });


module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		const adminPassword = encodeURIComponent( process.env.ADMIN_PASSWORD)
		const uri = `mongodb+srv://Roshhii:${adminPassword}@cluster0.uhbrj.mongodb.net/?retryWrites=true&w=majority`;
		mongoose.connect(uri, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};


/* const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = () => {
	const adminPassword = encodeURIComponent( process.env.ADMIN_PASSWORD)
	const uri = `mongodb+srv://Roshhii:${adminPassword}@cluster0.uhbrj.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
	client.connect(err => {
		console.log("Connected to database successfully");
		//const collection = client.db("test").collection("devices");
		// perform actions on the collection object
	});
}; */