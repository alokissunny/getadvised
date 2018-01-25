var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
var commentModel = require('../models/commentModel');
db.bind('comments');

var service = {};

 service.postComment = postComment;
 service.getAllComment =getAllComment
 module.exports = service;

function postComment (request) {
    var deffered = Q.defer();
    var data = commentModel.CommentModel(request);
    db.comments.insert(data,function(err){
        if(err)
        deffered.reject(err);
        deffered.resolve();
    })
    return deffered.promise;

}
function getAllComment(request) {
    var deffered = Q.defer();
    var param = request.params.id;
    var query = {advisorId : param};
    db.comments.find(query).sort({time: -1}).toArray(function(err,result) {
        if(err)
        deffered.reject(err);
        deffered.resolve(result);

    });
    return deffered.promise;
}