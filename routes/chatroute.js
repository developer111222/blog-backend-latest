const express=require('express');
const router=express.Router();
const {chatcontroller,getChats}=require('../controller/chatcontroller')
const { authorizationUser } = require('../middleware/auth');  

router.route('/user-chats').post(authorizationUser,chatcontroller);
router.route('/get-user-chats').get(authorizationUser,getChats);

module.exports = router;