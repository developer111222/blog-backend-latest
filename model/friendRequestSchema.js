const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user sending the request
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the request
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }, // Request status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
