var config = require('config.json');
var express = require('express');
var router = express.Router();
var queryService = require('services/query.service');

router.post('/query', postQuery);
// router.get('/', getAll);

module.exports = router;

//functions

function postQuery(req,res) {
    queryService.postQuery(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}