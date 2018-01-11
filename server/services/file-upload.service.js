var config = require('config.json');
var constants = require('constants/category.constant')
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('advisors');

var service = {};
service.updatePicInfo = updatePicInfo;

module.exports = service;

function updatePicInfo(req) {
    var deferred = Q.defer();
    isAdvisor = req.body.isAdvisor;
    query = { "username": req.body.me };
    updateObj = {
        $set: {
            photo: req.body.photo
        }
    };
    if (isAdvisor) {
        db.advisors.update(query, updateObj, function (err) {
            if (err)
                deferred.reject(err);
            deferred.resolve();
        });
    }
    else {
        db.users.update(query, updateObj, function (err) {
            if (err)
                deferred.reject(err);
            deferred.resolve();
        });
    }

    return deferred.promise;
};
