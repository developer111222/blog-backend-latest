const nodemailer = require('nodemailer');  

// Nodemailer transporter setup  
console.log(process.env.GMAIL_USER)
const transporter = nodemailer.createTransport({  
    service: 'gmail',  
    auth: {  
        user: 'anishprajapati765@gmail.com',
        // process.env.GMAIL_USER,  
        pass: 'bgep cgpj gxwa hoer',  
    },  
});  

// Function to send email  
exports.sendEmail = (mailOptions) => {  
    console.log(mailOptions,process.env.GMAIL_USER,process.env.GMAIL_PASS)
    return new Promise((resolve, reject) => {  
        transporter.sendMail(mailOptions, (error) => {  
            if (error) {  
                return reject(error);  
            }  
            resolve();  
        });  
    });  
};