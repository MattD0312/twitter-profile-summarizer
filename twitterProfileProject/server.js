var express = require("express");
var server = express();

server.use(express.static("public"));
server.listen(3000);

//var config = require('../config')
//var mykey = '0va785i7a7PYnFTmHuYnbZsgR';
//var secretkey = 'OpETfVMJupvLQ3ADjlwNeMvQsOoOYfUnEuawC1Bs7tjCKer05Q';

var config = {
  consumer_key : '0va785i7a7PYnFTmHuYnbZsgR',
  consumer_secret : 'OpETfVMJupvLQ3ADjlwNeMvQsOoOYfUnEuawC1Bs7tjCKer05Q',
  access_token : '3140677248-k1XlkRR3vzn3qZPqv6pd0XajXk4QjX9XI4owUmW',
  access_token_secret : 'zm4KfiiGdapigMtpVZxB2iVxKJoo1eSaKoYDSGraZ4V59'
}

var Twit = require('twit');

var T = new Twit(config);

//****Gets Timeline for a specified user****//
//parameters for the search
var timelineParams = {
  screen_name: "realdonaldtrump",
  count: 10,
  include_rts: false,
  tweet_mode: "extended"
}

T.get('statuses/user_timeline', timelineParams, getTimeline);

function getTimeline(err, data, response) {
  let tweetTextList = [];
  let hashtagList = [];
  for (i=0; i < data.length; i++) {
    console.log("NEW TWEET");
    console.log(data[i]);
    tweetTextList.push(data[i].full_text);
  }
  console.log(tweetTextList);
}
