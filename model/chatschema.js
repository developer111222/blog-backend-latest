const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // The users in the chat
    messages: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, timestamp: Date }]
});

module.exports = mongoose.model("Chat", chatSchema);
