require('rootpath')();
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
}).unless({ path: ['/users/authenticate', '/listFriends', '/users/register', '/advisors/register', /\/chat/i, /\/socket.io/i, /\/advisors\/get/i, '/upload', /\/advisors\/current/i] }));

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
// io.on('connection', function (socket) {
//     console.log('User connected');
//     socket.on('disconnect', function() {
//       console.log('User disconnected');
//     });
//     socket.on('save-message', function (data) {
//       console.log(data);
//       io.emit('new-message', { message: data });
//     });
//   });
var usersCollection = [];

// Express routes
// app.set("view engine", "vash");

// app.get("*",function(req, res){
//   res.render("index");
// });

app.post("/listFriends", function (req, res) {
    var clonedArray = usersCollection.slice();

    // Getting the userId from the request body as this is just a demo 
    // Ideally in a production application you would change this to a session value or something else
    var i = usersCollection.findIndex(x => x.id == req.body.userId);

    clonedArray.splice(i, 1);

    res.json(clonedArray);
});

// Socket.io operations
io.on('connection', function (socket) {
    console.log('A user has connected to the server.');

    socket.on('join', function (userInfo) {
        // Same contract as ng-chat.User
        username = userInfo.username;
        var index = usersCollection.findIndex(x => {
            return x.username == username;
        });
        if (index != -1) {
            return;
        }
        if (userInfo.isExpert) {
            usersCollection.push({
                id: socket.id, // Assigning the socket ID as the user ID in this example
                displayName: username,
                status: 0, // ng-chat UserStatus.Online,
                avatar: null
            });
        }


        socket.broadcast.emit("friendsListChanged", usersCollection);

        console.log(username + " has joined the expert room.");

        // This is the user's unique ID to be used on ng-chat as the connected user.
        socket.emit("generatedUserId", socket.id);

        // On disconnect remove this socket client from the users collection
        socket.on('disconnect', function () {
            console.log('User disconnected!');

            var i = usersCollection.findIndex(x => x.id == socket.id);
            usersCollection.splice(i, 1);

            socket.broadcast.emit("friendsListChanged", usersCollection);
        });
    });

    socket.on("sendMessage", function (message) {
        console.log("Message received:");
        console.log(message);

        io.to(message.toId).emit("messageReceived", {
            user: usersCollection.find(x => x.id == message.fromId),
            message: message
        });

        console.log("Message dispatched.");
    });
});
