var config = require('config.json');
var express = require('express');
var router = express.Router();
var commentService = require('services/comment.service');

// routes
router.post('/post', postComment);
router.get('/get/:id', getAllComment);
module.exports = router;

function postComment(req,res) {
    commentService.postComment(req.body)
    .then(function () {
        res.status(200).send("ok");
    })
    .catch(function(err) {
         res.status(400).send(err);
    })

}
function getAllComment(req, res) {
    commentService.getAllComment(req)
    .then(function(comments) {
        res.status(200).send(comments);
    })
    .catch(function(err) {
        res.status(400).send(err);
    })
}