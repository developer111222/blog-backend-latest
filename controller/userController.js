const User = require('../model/User');
const { sendEmail } = require('../utils/nodemailer');
const jwt = require('jsonwebtoken');

// Generate a random OTP  
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

console.log(process.env.JWT_SECRET, "secret")
// Generate a JWT  
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET, // Store this secret securely  
        { expiresIn: '1h' } // Token expires in 1 hour  
    );
};


//-------------------------------------------signup-------------------------------

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, "email");

    try {
        // Check if user already exists  
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ message: 'User already exists. Please login' });
            } else {
                // User exists but is not verified, send OTP
                const otp = generateOTP();
                user.otp = otp;
                user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry  
                await user.save();

                // Send OTP email  
                const mailOptions = {
                    to: email,
                    subject: 'Verify Your Email',
                    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
                };

                try {
                    await sendEmail(mailOptions);
                    return res.status(200).json({ message: 'OTP sent to your email for verification' });
                } catch (sendEmailError) {
                    console.error('Error sending email:', sendEmailError);
                    return res.status(500).json({ message: 'Error sending OTP email. Please try again later.' });
                }
            }
        }

        // Create a new user if it doesn't exist  
        user = new User({ email, password });
        await user.save();

        // Generate OTP and store it  
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry  
        await user.save();

        // Send OTP email  
        const mailOptions = {
            to: email,
            subject: 'Verify Your Email',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        };

        try {
            await sendEmail(mailOptions);
            res.status(200).json({ message: 'OTP sent to your email for verification' });
        } catch (sendEmailError) {
            console.error('Error sending email:', sendEmailError);
            return res.status(500).json({ message: 'Error sending OTP email. Please try again later.' });
        }

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//----------------------------------------verify otp -------------------------------------



exports.verifyuser = async (req, res) => {
    console.log(req.body);
    const { email, otp } = req.body;
    console.log('Request Body:', req.body); // Log the incoming request  
    try {
        const user = await User.findOne({ email });


        // Check if user exists  
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otpExpires = new Date(user.otpExpires).getTime();



        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (Date.now() > otpExpires) {
            return res.status(400).json({ message: 'OTP has expired' });
        }


        // OTP is valid; proceed with verification  
        user.isVerified = true;
        user.otp = undefined; // Clear OTP after verification  
        user.otpExpires = undefined; // Clear OTP expiry  
        await user.save();

        // Generate JWT token  
        const token = generateToken(user);
        // Set the cookie with options (e.g., httpOnly, secure)
        
        return res.cookie('token', token, {  
            httpOnly: true,  
            path: "/", // cookie path
        //   Domain: ".onrender.com", // domain for the cookie
          secure: true, // accessible through HTTP
          httpOnly: true, // only server can access the cookie
          sameSite: "none", // enforcement type
          partitioned: false, 
        }).status(200).json({ message: "Login successful" })  

    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//------------------------------resend otp------------------

exports.resendotp=async(req,res)=>{
    const { email } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });
    
    try {

        if (user) {
            if (!user.isVerified) {
            
                // User exists but is not verified, send OTP
                const otp = generateOTP();
                user.otp = otp;
                user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry  
                await user.save();

                // Send OTP email  
                const mailOptions = {
                    to: email,
                    subject: 'Verify Your Email',
                    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
                };

                try {
                    await sendEmail(mailOptions);
                    return res.status(200).json({ message: 'OTP sent to your email for verification' });
                } catch (sendEmailError) {
                    console.error('Error sending email:', sendEmailError);
                    return res.status(500).json({ message: 'Error sending OTP email. Please try again later.' });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


//---------------------------------login controller------------------------------------


exports.login = async (req, res) => {
    const { email, password } = req.body;  
    console.log(email, password);

    try {  
        const user = await User.findOne({ email });  
        if (!user) {  
            return res.status(400).json({ message: 'User not found' });  
        }  

        if (!user.isVerified) {  
            return res.status(400).json({ message: 'User not verified. Please verify your email.' });  
            
        }  

        const isMatch = await user.comparePassword(password);  
        if (!isMatch) {  
            return res.status(400).json({ message: 'Invalid credentials' });  
        }  

        const token = generateToken(user);  
        return res.cookie('token', token, {  
            httpOnly: true,  
            path: "/", // cookie path
        //   Domain: ".onrender.com", // domain for the cookie
          secure: true, // accessible through HTTP
          httpOnly: true, // only server can access the cookie
          sameSite: "none", // enforcement type
          partitioned: false, 
        }).status(200).json({ message: "Login successful" })  
       return res.status(200).json({ message: 'Login successful!', token });  
    } catch (error) {  
        console.error('Error during login:', error);  
        res.status(500).json({ message: 'Internal server error' });  
    }  
}



//----------------------------------- forgot password --------------------------------

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);

    if(!email){
        return res.status(400).json({ message: 'Please provide an email address' });
    }

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate a simple reset token
        const resetToken = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Set the reset token and expiration
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes expiration
        await user.save();

        // Send email with reset token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) requested a password reset. 
                   Please click on the following link to reset your password: ${resetUrl} 
                   This link will expire in 30 minutes.`,
        };

        await sendEmail(mailOptions);
     return   res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//----------------------------------- reset password --------------------------------

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is still valid
        });

       
        // Check if user exists and token is valid
        if (!user) {
            
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update the password
        user.password = newPassword;
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration
        await user.save();

        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




//--------------------------------------logout--------------------------------

exports.logout = (req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Logged out successfully' });
};











//-------------------------------get profile--------------------------------

exports.getprofile = async (req, res) => {


    try {
        const user = await User.findById(req.user); // Use req.user, set by the authorization middleware

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching user profile" });
    }
};


//-------------------------------get all users------------------------

exports.getUsers = async (req, res) => {
    try {
        const getusers = await User.find();

       return res.status(200).json({
            success: true,
            count: getusers.length,
             getusers,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error while fetching users" });
    }
};