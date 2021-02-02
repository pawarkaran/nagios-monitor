"use strict";


var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const nagios_1 = require("./nagios");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});






module.exports = router;
