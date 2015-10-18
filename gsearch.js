// You can change these as per your setup
var GSEApiKey = 'YOUR GOOGLE CUSTOM SEARCH ENGINE API HERE';
var hipchatCommand = '/google '; // That's what we use here
var hipchatUrl = 'YOUR HIPCHAT CALLBACK'; // Change as per HipChat

// The Google Search URI
// Change if using another API or version - note the key and query at the end
var searchUri = 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=%s&q=%s';

// App starts here
var express = require('express');
var bodyParser = require('body-parser');
var requestify = require('requestify');
sprintf = require('sprintf').sprintf;

// Setup and prep for parsing POST-JSON bodies from HipChat webhooks
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// We hook to POST since that's what we get from HipChat
app.post('/', function( req, res ) {
	// Avoid nasty non-item callbacks from the outside
	if ( undefined !== req.body.item ) {
		var query = req.body.item.message.message;
	
		var keyword = query.replace(hipchatCommand, '');
		var requestUrl = sprintf(searchUri, GSEApiKey, keyword);

		// Do a Google Search here
		requestify.request( requestUrl,	{
			 method: "GET", 
			 headers: {
				'ACCEPT' : 'application/json',
				'CONTENT-TYPE' : 'application/json; charset=utf-8'
			},
			dataType : 'json'
		 }).then( function(response) {
			response.getBody();
			var body = response.body;
			var resultSet = JSON.parse(body);

			// Pull the first record
			topRecord = resultSet.responseData.results[0];

			// Get the URL and Title
			var resultUrl = topRecord.url;
			var resultTitle = topRecord.titleNoFormatting;

			// Send a HipChat request with the result
			requestify.request( hipchatUrl, {
				method: "POST",
				headers: {
					'CONTENT-TYPE' : 'application/json'
				},
				body: {
				    "color": "green",
				    "message": resultTitle + ': ' + resultUrl,
				    "notify": false,
				    "message_format": "text"
				},
				dataType : 'json'
			}).then( function(response) {
			});
		});
	}
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
});
