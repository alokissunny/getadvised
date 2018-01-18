var config = require('config.json');
var constants = require('constants/category.constant')
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('advisors');

var service = {};

 service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.allCategories = allCategories;
service.getcat = getcat;
service.modifyUser = modifyUser;
module.exports = service;

function getcat(req) {
    var deferred =Q.defer();
    var query = {
    category : req.params._id
};
var lat = req.query.lat;
var lng = req.query.lng;

    var projection = {
        hash : false
    };
    db.advisors.find(query,projection).toArray(function(err ,result) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if(result)
        if(lat && lng) {
            result = filterResult(result,lat,lng);
        }
        deferred.resolve(result);

    });
    return deferred.promise;
}
function filterResult(result,lat,lng) {
    var temp =[];
for (var i = 0; i < result.length; i ++) {
    var distance = (lat-result[i].lat)*(lat-result[i].lat) + (lng-result[i].lng)*(lng-result[i].lng)
    result[i].distance = distance;
}
result.sort((res1, res2) => {
    return res1.distance - res2.distance;

})
return result;
}
function allCategories() {
    var deffered = Q.defer();
    setTimeout(function(){
        deffered.resolve(constants.CATEGORIES);
    },2)
    return deffered.promise;

}
function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.advisors.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createAdvisor();
            }
        });

    function createAdvisor() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.advisors.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
function authenticate(username, password) {
    var deferred = Q.defer();

    db.advisors.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo,
                isAdvisor : true,
                category :user.category,
                email : user.email,
                city: user.city,
                location : user.location,
                lat: user.lat,
                lng : user.lng,
                basicInfo : user.basicInfo,
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

    db.advisors.find().toArray(function (err, users) {
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

    db.advisors.findById(_id, function (err, user) {
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
function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.advisors.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.advisors.findOne(
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

        db.advisors.update(
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

    db.advisors.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

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
             category : req.body.category,
             basicInfo : req.body.basicInfo,
             location : req.body.location,
             city: req.body.city,
             lat : req.body.lat,
             lng : req.body.lng
         }
     }
     db.advisors.update(query,updateObj,function(err,user) {
         if (err) deferred.reject(err.name + ': ' + err.message);
          deferred.resolve(user);
     });
     return deferred.promise;
}