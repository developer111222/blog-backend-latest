const FriendRequest = require('../model/friendRequestSchema'); // Import friend request model
const Chat = require('../model/chatschema'); // Import chat model

// Controller to send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.body;
        const requesterId = req.user._id;  // The authenticated user sending the request
console.log(req.body,requesterId);
        // Check if there's already a pending or accepted request
        const existingRequest = await FriendRequest.findOne({
            requester: requesterId,
            recipient: friendId
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent or accepted' });
        }

        // Create a new friend request
        const friendRequest = new FriendRequest({
            requester: requesterId,
            recipient: friendId,
            status: 'pending'
        });
console.log(friendRequest);
        await friendRequest.save();
        res.status(201).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//----------------------------accept request --------------------------------


exports.acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;  // ID of the friend request
        const recipientId = req.user._id;  // The authenticated user accepting the request

        // Find the friend request
        const request = await FriendRequest.findById(requestId);
        if (!request || request.recipient.toString() !== recipientId.toString()) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Update the request status to 'accepted'
        request.status = 'accepted';
        await request.save();

        // Create a new chat between the two users
        const chat = new Chat({
            participants: [request.requester, request.recipient],
            messages: []  // No messages yet
        });

        await chat.save();

        res.status(200).json({ message: 'Friend request accepted. Chat started', chatId: chat._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//--------------------------------decline friend request---------------------------

exports.declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;  // ID of the friend request
        const recipientId = req.user._id;  // The authenticated user declining the request

        // Find the friend request
        const request = await FriendRequest.findById(requestId);
        if (!request || request.recipient.toString() !== recipientId.toString()) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Update the request status to 'declined'
        request.status = 'declined';
        await request.save();

        res.status(200).json({ message: 'Friend request declined' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getFriendRequests = async (req, res) => {
    const recipient=req.user._id;
    console.log(recipient);
    try {
        const friendRequests = await FriendRequest.find({recipient}).populate('requester', 'email');
        console.log(friendRequests);
        res.status(200).json(friendRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};