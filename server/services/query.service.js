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
service.getAll = getAll;
service.getRequestByAdvisor = getRequestByAdvisor;

module.exports = service;


function postQuery(req) {
    var deffered = Q.defer();
    var body = getQuery(req.body);
    db.queries.insert(body,function(err) {
    if(err)
        deffered.reject(err.name + ': ' + err.message);
        else
        deffered.resolve();
})
    return deffered.promise;
}

function getQuery(body) {
var qm =  QM.QueryModel(body);
return qm;
}

function  getAll(req) {
    var deffered = Q.defer();
    var query = {
};
    var projection = {
        _id : false
    };
    db.queries.find(query,projection).toArray(function(err, result) {
        if(err)
        deffered.reject(err);
        deffered.resolve(result);
    })
    return deffered.promise;
}

function getRequestByAdvisor(req) {
        var deffered = Q.defer();
    var query = {
        advisor: req.params.id
};
    var projection = {
        _id : false
    };
    db.queries.find(query,projection).toArray(function(err, result) {
        if(err)
        deffered.reject(err);
        deffered.resolve(result);
    })
    return deffered.promise;

}
