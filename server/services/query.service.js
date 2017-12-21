var config = require('config.json');
var constants = require('constants/category.constant')
var QM = require('models/queryModel')
var RM = require('../models/queryReplyModel');
var ObjectID = require('mongodb').ObjectID;
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
service.getRequestByRequestor = getRequestByRequestor;
service.recentQueries = recentQueries;
service.sendReply = sendReply;
service.updateReadStatus = updateReadStatus;
service.deleteMessage = deleteMessage;


module.exports = service;

function deleteMessage(req) {
      var deffered = Q.defer();
    var queryId = req.params.id;
     var query = {
        _id: new ObjectID((queryId))
    }
    db.queries.remove(query, function(err) {
         if(err)
        deffered.reject(err);
        deffered.resolve();
    });
    return deffered.promise;
}

function updateReadStatus(req) {
    var deffered = Q.defer();
    var queryId = req.params.id;
    var query = {
        _id: new ObjectID((queryId))
    }
    var updateObj = {
       $set: {
           unread : false
       }
    }
    db.queries.update(query,updateObj, function (err, res) {
        if(err)
        deffered.reject(err);
        deffered.resolve();
    });

    return deffered.promise;
}
function postQuery(req) {
    var deffered = Q.defer();
    var body = getQuery(req.body);
    db.queries.insert(body, function (err) {
        if (err)
            deffered.reject(err.name + ': ' + err.message);
        else
            deffered.resolve();
    })
    return deffered.promise;
}

function getQuery(body) {
    var qm = QM.QueryModel(body);
    return qm;
}

function getAll(req) {
    var deffered = Q.defer();
    var query = {
    };
    var projection = {
        _id: true
    };
    db.queries.find(query, projection).toArray(function (err, result) {
        if (err)
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
      //  _id: true
    };
    db.queries.find(query, projection).toArray(function (err, result) {
        if (err)
            deffered.reject(err);
        deffered.resolve(result);
    })
    return deffered.promise;

}

function getRequestByRequestor(req) {
    var deffered = Q.defer();
    var query = {
        requestor: req.params.id
    };
    var projection = {
       // _id: true
    };
    db.queries.find(query, projection).sort({requestOn : -1}).toArray(function (err, result) {
        if (err)
            deffered.reject(err);
        deffered.resolve(result);
    })
    return deffered.promise;

}
function recentQueries(req) {
     var deffered = Q.defer();
    var query = {
    };
    var projection = {
      //  _id: true
    };
    db.queries.find(query, projection).sort({_id:-1}).limit(parseInt(req.params.count)).toArray(function (err, result) {
        if (err)
            deffered.reject(err);
        deffered.resolve(result);
    })
    return deffered.promise;
}
function sendReply (req) {
     var deffered = Q.defer();
    var queryId = req.params.id;
    var body = RM.ReplyModel(req.body);
    var query = {
        _id : new ObjectID((queryId))
    }
    var update = {};
    db.queries.find(query, {reply : true}).toArray(function(err, result) {
         if (err)
            deffered.reject(err);

        var obj = result[0]["reply"];
        if (obj == undefined)
            update = body;
        else {
            update = obj;
            while(obj.reply)
            {
                obj = obj.reply;
            }
            obj.reply = body;
        };
         var updateObj = {
       $set: {
           reply : update
       }
    }
    db.queries.update(query,updateObj, function (err, res) {
        if(err)
        deffered.reject(err);
        deffered.resolve();
    });

    })


    // var updateObj = {
    //    $set: {
    //        reply : body
    //    }
    // }
    // db.queries.update(query,updateObj, function (err, res) {
    //     if(err)
    //     deffered.reject(err);
    //     deffered.resolve();
    // });

    return deffered.promise;

}
