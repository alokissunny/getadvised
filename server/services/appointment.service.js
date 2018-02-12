var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('appointment');

var service = {};

service.bookAppointment = bookAppointment;
service.cancelAppointment = cancelAppointment;
service.findAppointmentByAdvisor = findAppointmentByAdvisor;
service.findAppointmentByRequestor = findAppointmentByRequestor;

module.exports = service;

function bookAppointment(bookParam) {
    var deffered = Q.defer();
    var bid = _.uniqueId('bid');//createBookingId();
    bookParam.bookingId = bid;
    db.appointment.insert(bookParam, function (err, res) {
        if (err)
            deffered.reject(err.name + ': ' + err.message);
        deffered.resolve({
            bid: bid
        });
    });
    return deffered.promise;

}
function cancelAppointment(appointmentid) {
    var deffered = Q.defer();
    //todo add security 
    db.appointment.remove({ bookingId: appointmentid }, function (err, res) {
        if (err)
            deffered.reject(err.name + ': ' + err.message);
        deffered.resolve()
    })
    return deffered.promise;
}

function findAppointmentByAdvisor(request) {
    var deffered = Q.defer();
    var query = { "advisor": request.params.id };
    db.appointment.find(query).toArray(function (err, result) {
        if (err)
            deffered.reject(err);
        deffered.resolve(result);
    });
    return deffered.promise;

}

function findAppointmentByRequestor(request) {
    var deffered = Q.defer();
    var query = { "requestor": request.params.id };
    db.appointment.find(query).toArray(function (err, result) {
        if (err)
            deffered.reject(err);
        deffered.resolve(result);
    });
    return deffered.promise;

}