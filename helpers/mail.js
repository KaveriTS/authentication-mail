const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const User = require('../models/userModel');
const route = require('../route/userRoute');


const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
const transporter = nodemailer.createTransport(mailGun(auth));
async function sendMail(email) {
    var mailOptions = {
    from: 'kaverits07@gmail.com',
    to: email,
    subject: 'Registration Successful',
    text: 'Welcome!'
  };

transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}
// Exporting the sendmail
module.exports.sendMail = sendMail;