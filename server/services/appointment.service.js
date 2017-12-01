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
 module.exports = service;

 function bookAppointment(bookParam) {
     var deffered = Q.defer();
     var bid = _.uniqueId('bid');//createBookingId();
     bookParam.bookingId = bid;
     db.appointment.insert(bookParam,function(err,res) {
         if (err)
         deffered.reject(err.name + ': ' + err.message);
             deffered.resolve({
                 bid : bid
             });
     });
     return deffered.promise;

 }
 function cancelAppointment(appointmentid) {

 }