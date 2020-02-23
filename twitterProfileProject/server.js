var express = require("express");
var server = express();

server.use(express.static("public"));
server.listen(3000);

var Twit = require('twit');
var config = require('../config')

var mykey = '0va785i7a7PYnFTmHuYnbZsgR';
var secretkey = 'OpETfVMJupvLQ3ADjlwNeMvQsOoOYfUnEuawC1Bs7tjCKer05Q';
