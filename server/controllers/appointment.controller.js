var config = require('config.json');
var express = require('express');
var router = express.Router();
var appointment = require('services/appointment.service');

// routes
router.post('/book', bookAppointment);
router.post('/cancel', cancelAppointment);
router.get('/advisor/:id', findAppointmentByAdvisor);
router.get('/requestor/:id', findAppointmentByRequestor);
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
    appointment.cancelAppointment(req.body.bid)
    .then(function() {
        res.status(200).send("ok");
    })
    .catch(function(err) {
        res.status(400).send(err);
    })
}

function findAppointmentByAdvisor (req, res ) {
    appointment.findAppointmentByAdvisor(req)
    .then(function (appointments) {
        res.status(200).send(appointments);
    })
    .catch(function(err) {
         res.status(400).send(err);
    })
}
function findAppointmentByRequestor (req, res ) {
    appointment.findAppointmentByRequestor(req)
    .then(function (appointments) {
        res.status(200).send(appointments);
    })
    .catch(function(err) {
         res.status(400).send(err);
    })
}