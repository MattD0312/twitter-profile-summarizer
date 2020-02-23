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

//TODO: PUT IN FUNCTION TO BE CALLED BY SEAN
T.get('statuses/user_timeline', timelineParams, getTimeline);

function getTimeline(err, data, response) {
  var tweetTextList = [];
  var hashtagDict = {};
  let tempText = ""; //used when removing bad substrings from text
  let articles = [" I ", " a ", " the ", " in ", " an ", " he ", " she ", " you ", " that ", " this ", " is ", " we ", " us ", " to "];
  let otherBadStuff = [".", "!", ",", "/", "?", /\shttps?.+?(?=$)/, /\shttps?.+?(?=[\n ])/];

  //get text of each tweet into array
  data.forEach(function(tweet) {
    tempText = tweet.full_text; //to be stripped away
    articles.forEach(function(article) {tempText = tempText.replace(article, " ")}); //strip away bad articles
    otherBadStuff.forEach(function(badStuff) {tempText = tempText.replace(badStuff, "")}); //strip away bad punctuation
    tweetTextList.push(tempText);
    countHashtags(tweet); //call function to count hashtags, add to dict based on frequency
  });
}

function countHashtags(tweet) {
  console.log("TODO"); 
}
server.get('/getData', (req, res) => {
  n = req.url; //n is url
  console.log(n);
  var userParams = {
    q: 'Donald Trump',
    count: 1
  }

  T.get('users/search', userParams, searchedData);

  function searchedData(err, data, response) {  	
    if (data.length>0){
      console.log('exists')
    }

    if (data.length==0){
      console.log('null')
    }
  }
});

