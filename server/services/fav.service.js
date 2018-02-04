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