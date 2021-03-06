﻿var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var advisorService = require('services/advisor.service');
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.modifyUser = modifyUser;
service.isUnique = isUnique;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo,
                email : user.email,
                city: user.city,
                lat: user.lat,
                lng: user.lng,
                phone: user.phone,
                 isAdvisor : false,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    // db.users.findOne(
    //     { username: userParam.username },
    //     function (err, user) {
    //         if (err) deferred.reject(err.name + ': ' + err.message);

    //         if (user) {
    //             // username already exists
    //             deferred.reject('Username "' + userParam.username + '" is already taken');
    //         } else {
    //             createUser();
    //         }
    //     });
        isUnique(userParam.username)
        .then((user) => {
            if (user)
                deferred.reject('Username "' + userParam.username + '" is already taken');
            else {
                advisorService.isUnique(userParam.username)
                    .then((user) => {
                        if (user) {
                            deferred.reject('Username "' + userParam.username + '" is already taken');
                        }
                        else {
                            createUser();
                        }
                    })

            }
        })
        .catch((err) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
        })

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
function modifyUser(req) {
     var deferred = Q.defer();
     var query = {username : req.body.username }
     var updateObj = {
         $set : {
             firstName : req.body.firstName,
             lastName : req.body.lastName,
             email : req.body.email,
             city: req.body.city,
             lat: req.body.lat,
             lng: req.body.lng,
              phone: req.body.phone,
         }
     }
     db.users.update(query,updateObj,function(err,user) {
         if (err) deferred.reject(err.name + ': ' + err.message);
          deferred.resolve(user);
     });
     return deferred.promise;
}
function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
function isUnique(username) {
    var deferred = Q.defer();
    var query = { username: username };
    db.users.findOne(query, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(user);
    });
    return deferred.promise;
}
