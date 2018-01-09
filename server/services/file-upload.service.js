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
service.updatePicInfo = updatePicInfo;

module.exports = service;

function updatePicInfo(req){
    var deferred = Q.defer();
    query ={"username" : req.body.me};
    updateObj = {
         $set: {
           photo : req.body.photo
     }};
    
    db.users.update(query,updateObj,function(err) {
         if(err)
        deferred.reject(err);
        deferred.resolve();
    });
    return deferred.promise;
};
