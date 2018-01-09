//require express library
var express = require('express');
var fileService = require('services/file-upload.service');
//require the express router
var router = express.Router();
//require multer for the file uploads
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var DIR = '../uploads/images';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');
/* GET home page. */

// router.get('/', function(req, res, next) {
// // render the index page, and pass data to it.
//   res.render('index', { title: 'Express' });
// });

//our file upload function.
router.post('/', function (req, res, next) {
     var path = '';
     upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }
       // No error occured.
        path = req.file.path;
        return res.send({"profile-id" : path});
  });
});
router.post('/updateimage',updatePicInfo);
module.exports = router;

function updatePicInfo(req,res) {

  fileService.updatePicInfo(req)
    .then(function (obj) {
        res.status(200).send(obj);
    })
    .catch(function(err) {
         res.status(400).send(err);
    })

}
   