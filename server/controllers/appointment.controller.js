var config = require('config.json');
var express = require('express');
var router = express.Router();
var appointment = require('services/appointment.service');

// routes
router.post('/book', bookAppointment);
router.delete('/cancel?bid', bookAppointment);
module.exports = router;

function bookAppointment(req,res) {
    appointment.bookAppointment(req.body)
    .then(function (obj) {
        res.status(400).send(obj);
    })
    .catch(function(err) {
         res.status(400).send(err);
    })

}