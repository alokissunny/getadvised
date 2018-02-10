var config = require('config.json');
var express = require('express');
var router = express.Router();
var favService = require('services/fav.service');


// routes

router.post('/add',addToFav);
router.post('/delete', removeFav);

module.exports = router;


function addToFav(req, res) {
    favService.addToFav(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getFav(req, res) {
    favService.getFav(req)
        .then(function (res) {
            res.send(res);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function removeFav(req, res) {
    favService.removeFav(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}