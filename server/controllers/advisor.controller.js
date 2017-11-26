var config = require('config.json');
var express = require('express');
var router = express.Router();
var advisorService = require('services/advisor.service');

//routes
router.post('/register', register);
router.post('/authenticate', authenticate);

module.exports = router;



//functions
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