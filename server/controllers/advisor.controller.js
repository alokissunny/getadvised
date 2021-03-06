var config = require('config.json');
var express = require('express');
var router = express.Router();
var advisorService = require('services/advisor.service');
var userService = require('services/user.service');
var favService = require('services/fav.service');

//routes
router.post('/register', register);
router.post('/authenticate', authenticate);
router.get('/', getAll);
router.get('/get/:_id', getcat);
router.get('/current/:id', getCurrent);
router.get('/fav/:id', getfavlist);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/allcat', allCategories);
router.post('/rate', updateRating);

module.exports = router;

function getcat(req, res) {
    advisorService.getcat(req)
        .then(function (advs) {
            res.send(advs);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

//functions
function allCategories(req, res) {
    advisorService.allCategories()
        .then(function (cats) {
            res.send(cats);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}
function register(req, res) {
    advisorService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function authenticate(req, res) {
    advisorService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getAll(req, res) {
    advisorService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    advisorService.getById(req.params.id)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getfavlist(req, res) {
    favService.getFav(req.params.id)
        .then(function (result) {
            var usernames = [];
            for (var i = 0; i < result.length; i++) {
                usernames.push(result[i]["fav"]);
            }
            if(usernames.length == 0 ) {
                res.send([]);
            }
            else {
            advisorService.getByUsernames(usernames)
                .then(function (result) {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            }

        })
        .catch(err => {
            res.status(400).send(err);
        });
}

function update(req, res) {
    advisorService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    advisorService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function updateRating(req, res) {
    advisorService.updateRating(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}