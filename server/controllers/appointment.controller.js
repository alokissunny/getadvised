var config = require('config.json');
var express = require('express');
var router = express.Router();
var appointment = require('services/appointment.service');

// routes
router.post('/bookappointment', bookappointment);

function bookappointment(req,res) {
    appointment.bookAppointment(req.body)
    .then(function () {
        res.sendStatus = 200;
    })
    .catch(function(err) {
         res.status(400).send(err);
    })

}