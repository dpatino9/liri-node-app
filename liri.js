// Load the NPM Packages
var Twitter = require('twitter');
var spotify = require("spotify");
var request = require('request');

// Load keys.js and fs
var keys = require("./keys.js");
var fs = require("fs");

// Take in the command line arguments
var params = process.argv.slice(2);

// Used a swicth case to make functions run
switch(params[0]) {
  case "my-tweets":
    tweetsCall();
    break;
  case "spotify-this-song":
    if(params[1]){
      spotifyCall(params[1]);
    }else {
      spotifyCall("What\'s my age again")
    }
    break;
  case "movie-this":
  if(params[1]){
      movieCall(params[1]);
    }else {
      movieCall("Top Gun")
    }
    break;
  case "do-what-it-says":
    saysCall(params[1]);
    break;
}

// Grabbing all the twitter keys and displays tweets, then logs them and appends them
function tweetsCall(){
  var client = new Twitter(keys.twitterKeys);
    
  client.get('statuses/user_timeline', {screen_name: 'Go_DiegoCode_Go'}, function (error, data, response){
    for(var i = 0; i < data.length; i++){
      
      var tweetResults = data[i].text + "\r\n" + data[i].created_at;
      
      console.log(tweetResults);
      
      fs.appendFile("log.txt", tweetResults + "\r\n" + "\r\n", function(err) {
        if(err) {
          return console.log(err);
        }
      });
    };
  });
}  

// Pulls spotify results from Spotify, then logs them and appends them
function spotifyCall (arg) {
  spotify.search({ type: 'track', query: arg }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    var albumInfo = data.tracks.items[0];
    var spotifyResults = "Artist: " + albumInfo.artists[0].name + "\r\n" +
                         "Track Name: " + albumInfo.name + "\r\n" + 
                         "Preview Link: " + albumInfo.preview_url + "\r\n" +
                         "Album: " + albumInfo.album.name;
    console.log(spotifyResults);
    fs.appendFile("log.txt", spotifyResults + "\r\n" + "\r\n" , function(err) {
      if(err) {
        return console.log(err);
      }
    });
  });
};


// Pulls movie info from OMDB and displays, then logs them and appends them
function movieCall () {
  var omdbApi = 'http://www.omdbapi.com/?t=';
  var query = params[1];
  var jsonEnd = '&y=&plot=short&r=json&tomatoes=true';
  
  request(omdbApi+query+jsonEnd, function (error, response, body) {
    if (!error && response.statusCode == 200) {


      var movieResults = "Title: "+ JSON.parse(body)["Title"]+ "\r\n" +
                         "Year: "+ JSON.parse(body)["Year"]+ "\r\n" +
                         "IMDB Rating: "+ JSON.parse(body)["imdbRating"]+ "\r\n" +
                         "Country: "+ JSON.parse(body)["Country"]+ "\r\n" +
                         "Language: "+ JSON.parse(body)["Language"]+ "\r\n" +
                         "Plot: "+ JSON.parse(body)["Plot"]+ "\r\n" +
                         "Actors: "+ JSON.parse(body)["Actors"]+ "\r\n" +
                         "Rotten Tomatoes Rating: "+ JSON.parse(body)["tomatoRating"];
      console.log(movieResults);
      fs.appendFile("log.txt", movieResults + "\r\n" + "\r\n" , function(err) {
        if(err) {
          return console.log(err);
        }
      });
    }
  });
}

function saysCall (){
  fs.readFile("random.txt", "utf8", function(err, data){
    data = data.split(',');
    spotifyCall(data[1]) 
  });
};
