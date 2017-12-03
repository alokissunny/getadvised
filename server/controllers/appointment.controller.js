var config = require('config.json');
var express = require('express');
var router = express.Router();
var appointment = require('services/appointment.service');

// routes
router.post('/book', bookAppointment);
router.post('/cancel', cancelAppointment);
module.exports = router;

function bookAppointment(req,res) {
    appointment.bookAppointment(req.body)
    .then(function (obj) {
        res.status(200).send(obj);
    })
    .catch(function(err) {
         res.status(400).send(err);
    })

}
function cancelAppointment(req, res) {
    debugger;
    appointment.cancelAppointment(req.body.bid)
    .then(function() {
        res.status(200).send("ok");
    })
    .catch(function(err) {
        res.status(400).send(err);
    })
}