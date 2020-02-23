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
  let tempText = ""; //used when removing bad substrings from text
  let articles = [" I ", " a ", " the ", " in ", " an ", " he ", " she ", " you ", " that ", " this ", " is ", " we ", " us ", " to "];
  let otherBadStuff = [".", "!", ",", "/", "?", /\shttps?.+?(?=$)/, /\shttps?.+?(?=[\n ])/];

  //get text of each tweet into array
  data.forEach(function(tweet) {
    tempText = tweet.full_text; //to be stripped away
    articles.forEach(function(article) {tempText = tempText.replace(article, " ")}); //strip away bad articles
    otherBadStuff.forEach(function(badStuff) {tempText = tempText.replace(badStuff, "")}); //strip away bad punctuation
    tweetTextList.push(tempText)
     
    
  });
        word_list=[];
     for (i in tweetTextList){

          word_list.push(tweetTextList[i].split(' '));

        }

        console.log(word_list);


  };

function compressArray(original) {

        var compressed = [];
        // make a copy of the input array
        var copy = original.slice(0);

        // first loop goes over every element
        for (var i = 0; i < original.length; i++) {

                var myCount = 0;
                // loop over every element in the copy and see if it's the same
                for (var w = 0; w < copy.length; w++) {
                        if (original[i] == copy[w]) {
                                // increase amount of times duplicate is found
                                myCount++;
                                // sets item to undefined
                                delete copy[w];
                        }
                }

                if (myCount > 0) {
                        var a = new Object();
                        a.value = original[i];
                        a.count = myCount;
                        compressed.push(a);
                }
        }

        return compressed;
};




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
