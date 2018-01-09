var config = require('config.json');
var constants = require('constants/category.constant')
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};
service.updateDpInfo = updateDpInfo;

module.exports = service;

function updateDpInfo(req){
    var deferred = Q.defer();
    return deferred.promise;
};
