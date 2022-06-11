const mongoose = require("mongoose");

const recordsSchema = new mongoose.Schema({
	sessionId: { type: String, required: true },
	date: { type: Date, required: true },
	username: { type: String, required: true },
	email: { type: String, required: true },
	userStory: { type: Array, required: true },
	tasks: { type: Array, required: true },
	votes: { type: Array, required: true },
});

const Records = mongoose.model("records", recordsSchema);

module.exports = { Records }


