var express = require("express");
var server = express();

server.use(express.static("../twitterProfileProject/public"));
//server.get('/', function(req, res) {
//	res.send('index.html');
//});

server.listen(process.env.PORT || 8080);

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

//MUST BE GLOBAL, Makes it work
var hashtagDict = {}
var tweetTextList = []
var wordDict = {}
var shortHashtagDict = {};
var shortWordDict = {};

//****Gets Timeline for a specified user****//
function callEndpointTimeline(name) {
  console.log("name:", name) //tests name being searched
  //parameters for the search
  var timelineParams = {
    screen_name: name,
    include_rts: false,
    count: 500,
    tweet_mode: "extended"
  }
  T.get('statuses/user_timeline', timelineParams, getTimeline);
}

function getTimeline(err, data, response) {
  hashtagDict = {};
  wordDict = {};
  shortHashtagDict = {};
  shortWordDict = {};
  var tempText = ""; //used when removing bad substrings from text
  //TODO: FIX REGEX TO CHECK AGAINST CAPITALIZATION (REDUCE ARTICLES IN FINAL DICT
  var articles = [ " so ", /^so/, /so$/, /[w|W]ill/, /^will/, /will$/, " I ", /^I/, /I$/, " i ", /^i/, /i$/, " a ", /^a/, /a$/, " the ", /^the/, /the$/, " in ", /^in/, /in$/, " an ", /^an/, /an$/, " he ", /^he/, /he$/, " she ", /^she/, /she$/, " you ", /^you/, /you$/, " that ", /^that/, /that$/, " this ", /^this/, /this$/, " is ", /^is/, /is$/, " we ", /^we/, /we$/, " us ", /^us/, /us$/, " to ", /^to/, /to$/, " and ", /^and/, /and$/, " are ", /^are/, /are$/, " be ", /^be/, /be$/, " for ", /^for/, /for$/, " of ", /^of/, /of$/, " on ", /^on/, /on$/, " our ", /^our/, /our$/, " was ", /^was/, /was$/];
  var otherBadStuff = [".", "!", ",", "/", "?", /\shttps?.+?(?=$)/, /\shttps?.+?(?=[\n ])/];

  //get text of each tweet into array
  data.forEach(function(tweet) {
    tempText = tweet.full_text; //to be stripped away
    otherBadStuff.forEach(function(badStuff) {tempText = tempText.replace(badStuff, "")}); //strip away bad punctuation
    articles.forEach(function(article) {tempText = tempText.replace(article, " ")}); //strip away bad articles
    tweetTextList.push(tempText)
    countHashtags(tweet); //call function to count hashtags
  });
    countWords(tweetTextList);
    getTopHashtags();
    getTopWords();
};

//helper function to getTimeline, counts words 
function countWords(textList) {
  var word_list = [];
  var delim = /\s+/
  for (i in textList) {
    word_list.push(textList[i].split(delim));
  }
  
  for (i = 0; i < word_list.length; i++) {
    for (j = 0; j < word_list[i].length; j++) {
      if (word_list[i][j] in wordDict) {
        wordDict[word_list[i][j]] += 1;
      }
      else {
        wordDict[word_list[i][j]] = 1;
      }
    }
  }
}

//helper function to getTimeline, counts hashtags
function countHashtags(tweet) {
  var hashtags = tweet.entities.hashtags;

  for (i = 0; i < hashtags.length; i++) {
    var tag = hashtags[i].text.toLowerCase();

    if (tag in hashtagDict) {
      hashtagDict[tag] += 1; //does exist, inc by 1
    }
    else {
      hashtagDict[tag] = 1; //doesn't exist, set it to 1
    }
  }
}

//fills out shortHashtagDict with 10 most frequently used hashtags in hashtagDict
function getTopHashtags() {
  counter = 0; //counts up to how many hashtags you want
  maxHashtags = 10; //how many hashtags 
  for (var key in hashtagDict) {
    if (counter < maxHashtags) {
      shortHashtagDict[key] = hashtagDict[key] //build default to compare against
      counter += 1;
    }
    else {
      for (var shortKey in shortHashtagDict) { //check against shortDict
        if (hashtagDict[key] > shortHashtagDict[shortKey]) {
          delete shortHashtagDict[shortKey]; //remove hashtag with shorter value
	  shortHashtagDict[key] = hashtagDict[key]; //replace with bigger value and hashtag
	  break; //leave loop, don't want to replace too many
	}
      }
      console.log(shortHashtagDict);
      console.log("RESET");
    }
  }
  console.log(hashtagDict);
}

//fills out shortWordDict with 10 most frequently used words in wordDict
function getTopWords() {
  counter = 0; //counts up to how many words you want
  maxWords = 10; //how many words 
  for (var key in wordDict) {
    if (counter < maxWords) {
      shortWordDict[key] = wordDict[key] //build default to compare against
      counter += 1;
    }
    else {
      for (var shortKey in shortWordDict) { //check against shortDict
        if (wordDict[key] > shortWordDict[shortKey]) {
          delete shortWordDict[shortKey]; //remove word with shorter value
	  shortWordDict[key] = wordDict[key]; //replace with bigger value and hashtag
	  break; //leave loop, don't want to replace too many
	}
      }
      console.log(shortWordDict);
      console.log("RESET");
    }
  }
  console.log(wordDict);
}
//gets username, recieves name from client
server.get('/getData', (req, res) => {
  n = req.url.toString().split("="); //n is url
  username = n[1];

  var userParams = {
    q: username,
    count: 1
  }

  T.get('users/search', userParams, checkUser);
  
  function checkUser(err, data, response) {
    if (data.length>0) { //if it exists
      callEndpointTimeline(username);
      setTimeout(function() { res.send([shortWordDict, shortHashtagDict]); }, 1000);
    }

    if (data.length==0) { //if it doesn't exist
      console.log(username);
      res.send(['error']);
    }
  }
});
