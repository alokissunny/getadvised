var config = require('config.json');
var express = require('express');
var router = express.Router();
var queryService = require('services/query.service');

router.post('/query', postQuery);
router.get('/', getAll);
router.get('/recentQueries/:count', recentQueries);
router.get('/advisor/:id', getRequestByAdvisor);
router.get('/requestor/:id', getRequestByRequestor);
router.post('/sendreply/:id', sendReply);
router.post('/read/:id', updateReadStatus);
router.post('/readr/:id', updateReadStatusForRequestor);
router.post('/reada/:id', updateReadStatusForAdvisor);
router.post('/delete/:id', deleteMessage);
router.post('/deleter/:id', deleteMessageRequestor);
router.post('/deletea/:id', deleteMessageAdvisor);

module.exports = router;

//functions
function deleteMessage(req, res) {
    queryService.deleteMessage(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

function deleteMessageRequestor(req, res) {
    queryService.softdeleteForRequestor(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

function deleteMessageAdvisor(req, res) {
    queryService.softdeleteForAdvisor(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}
function updateReadStatus(req, res) {
    queryService.updateReadStatus(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}
function updateReadStatusForRequestor(req, res) {
    queryService.updateReadStatusForRequestor(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}
function updateReadStatusForAdvisor(req, res) {
    queryService.updateReadStatusForAdvisor(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}
function postQuery(req, res) {
    queryService.postQuery(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getAll(req, res) {
    queryService.getAll(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function recentQueries(req, res) {
    queryService.recentQueries(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getRequestByAdvisor(req, res) {
    queryService.getRequestByAdvisor(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getRequestByRequestor(req, res) {
    queryService.getRequestByRequestor(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function sendReply(req, res) {
    queryService.sendReply(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}