var express = require('express');
var router = express.Router();
var path = require('path');


var visitController = require("../controllers/visitController");

/* GET home page. */
router.get('/', function(req, res, next) {
  visitController.newVisit(req, res, next);
});


module.exports = router;
