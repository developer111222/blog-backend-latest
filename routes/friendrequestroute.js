const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, declineFriendRequest,getFriendRequests } = require('../controller/FriendRequestController');
const { authorizationUser } = require('../middleware/auth');  // JWT authorization middleware

// Send a friend request
router.route('/friend-request').post( authorizationUser, sendFriendRequest);

// Accept a friend request
router.route('/friend-request/accept').post( authorizationUser, acceptFriendRequest);

// Decline a friend request
router.route('/friend-request/decline').post( authorizationUser, declineFriendRequest);
router.route('/get-friend-request').get( authorizationUser, getFriendRequests);

module.exports = router;
