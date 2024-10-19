const express = require('express');  
const router = express.Router();  
const {signup,verifyuser,login,getprofile,forgotPassword,resetPassword,logout,resendotp} = require('../controller/userController');  
const { authorizationUser } = require('../middleware/auth');  

// Route to signup user and send OTP  
router.route('/sign').post(signup)

// Route to verify email and get a token  
router.route('/otp').post(verifyuser);  
router.route('/login').post(login);
router.route('/resendotp').post(resendotp);
router.route('/profile').get(authorizationUser,getprofile)
router.route('/logout').post(authorizationUser,logout)
router.route('/forget-password').post(forgotPassword)
router.route('/reset-password/').post(resetPassword)

module.exports = router;