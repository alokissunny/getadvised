var config = require('config.json');
var favModel = require('../models/favModel');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('fav');

var service = {};

service.addToFav = addToFav;
service.getFav = getFav;
service.removeFav = removeFav;

module.exports = service;

function addToFav(req) {
    var deferred = Q.defer();
    var body = req.body;
    var model = favModel.FavModel(body);
    db.fav.insert(
                model,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
            return deferred.promise;

}
function getFav(username) {
     var deferred = Q.defer();
     var query = {username : username};
     db.fav.find(query).toArray(function (err, result){
        if(err) {
            deferred.reject(err);
        }
        deferred.resolve(result);
     });
     return deferred.promise;

}
function removeFav(req) {
    var body = req.body;
     var deferred = Q.defer();
     var query = { $and : [{username : body.username} , {fav : body.fav}]} ;
     db.fav.remove(query,function (err){
        if(err) {
            deferred.reject(err);
        }
        deferred.resolve();
     });
     return deferred.promise;

}