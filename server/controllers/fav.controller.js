var config = require('config.json');
var express = require('express');
var router = express.Router();
var favService = require('services/fav.service');


// routes

router.post('/add',addToFav);

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