var config = require('config.json');
var constants = require('constants/category.constant')
var QM = require('models/queryModel')
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('queries');
var service = {};

 service.postQuery = postQuery;
//service.getAll = getAll;

module.exports = service;


function postQuery(req) {
    var deffered = Q.defer();
    var body = getPostQuery(req.body);
    return deffered.promise;
}
function getPostQuery(body) {
var qm =  QM.QueryModel(body);
}
