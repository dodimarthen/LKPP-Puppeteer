const nodemailer = require('nodemailer');
const {user_email_mailer, password_email_mailer, receiver_testing_email} = require('./config.js');
// Set up transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user_email_mailer, 
        pass: password_email_mailer 
    }
});

// Compose mail options
const mailOptions = {
    from: user_email_mailer, 
    to: receiver_testing_email, 
    subject: 'Test Email', 
    text: 'testing testing' 
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
