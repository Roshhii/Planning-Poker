const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
	username: { type: String, required: true },
	mail: { type: String, required: true },
	sessions: { type: Array, required: true },
});

const History = mongoose.model("history", historySchema);

module.exports = { History }


