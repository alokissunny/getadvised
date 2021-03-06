﻿require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('../uploads'))

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register','/advisors/register' ,/\/chat/i ,/\/socket.io/i, /\/advisors\/get/i  , '/upload',/\/advisors\/current/i ] }));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/advisors', require('./controllers/advisor.controller'));
app.use('/appointment', require('./controllers/appointment.controller'));
app.use('/ask', require('./controllers/query.controller'));
app.use('/upload', require('./controllers/file-upload.controller'));
app.use('/comment', require('./controllers/comment.controller'));
app.use('/fav', require('./controllers/fav.controller'));
app.use('/chat', require('./controllers/chat'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
var io = require('socket.io')(server);
// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
    socket.on('save-message', function (data) {
      console.log(data);
      io.emit('new-message', { message: data });
    });
  });
  