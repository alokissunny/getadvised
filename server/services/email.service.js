var nodemailer = require('nodemailer');
var service = {};
service.sendMail = sendMail;
module.exports = service;


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'getexpert22@gmail.com',
        pass: 'getexpert12345678'
    }
});

var mailOptions = {
    from: 'getexpert22@gmail.com',
    to: 'todo',
    subject: 'New Query',
    html: '<b>You Have a new Query....Login </b><a>getexpert.in</a> <b>for more info</b>'
};


function sendMail(target) {
    mailOptions.to = target;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}