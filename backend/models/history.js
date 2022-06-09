const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
	username: { type: String, required: true },
	mail: { type: String, required: true },
	userStory: { type: Array, required: true },
	tasks: { type: Array, required: true },
	votes: { type: Array, required: true },
});

const History = mongoose.model("history", historySchema);

module.exports = { History }


