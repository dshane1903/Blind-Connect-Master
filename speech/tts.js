/**
Copyright (c) Microsoft Corporation
All rights reserved.
MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
var util = require('util'),
  https = require('https');

var audio;

 exports.Synthesize = function Synthesize(inputText){


   var desiredText = inputText;

	// Note: The way to get api key:
        // Free: https://www.microsoft.com/cognitive-services/en-us/subscriptions?productId=/products/Bing.Speech.Preview
        // Paid: https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Bing.Speech/pricingtier/S0
	var apiKey = "cb43a35ea21840e3b91671cac2a50faa";
	var post_data = "";

	var AccessTokenUri = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";

	var post_option = {
		hostname: 'api.cognitive.microsoft.com',
		port: 443,
		path: '/sts/v1.0/issueToken',
		method: 'POST'
	};

	post_option.headers = {
		'Ocp-Apim-Subscription-Key' : apiKey,
		'Content-Length' : post_data.length
	};

	var post_req = https.request(post_option, function(res){
	  var accessToken="";
	   res.on('data', function(buffer){
		 accessToken += buffer;
		 });

		 // end callback
		res.on('end', function(){
		// console.log("Access token: ", accessToken);

		// call tts service
		var https = require('https');

	var ttsServiceUri = "https://speech.platform.bing.com/synthesize";

	var post_option = {
		hostname: 'speech.platform.bing.com',
		port: 443,
		path: '/synthesize',
		method: 'POST'
	};

	var SsmlTemplate = "<speak version='1.0' xml:lang='en-us'><voice xml:lang='%s' xml:gender='%s' name='%s'>%s</voice></speak>";
	var post_speak_data = util.format(SsmlTemplate, 'en-US', 'Female', 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)', desiredText);

	post_option.headers = {
		'content-type' : 'application/ssml+xml',
		'Content-Length' : post_speak_data.length,
		'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
		'Authorization': 'Bearer ' + accessToken,
		'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
		'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
		"User-Agent": "TTSNodeJS"
	};

	var post_req = https.request(post_option, function(res){
	  var _data="";
	   res.on('data', function(buffer){
		   //get the wave
		   _data += buffer;
		 });

     audio = _data;
     console.log(audio);

		 // end callback
		res.on('end', function(){

		console.log('wave data.length: ' + _data.length);
		});

		post_req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		});
	});

	console.log('\n\ntts post_speak_data: ' + post_speak_data + '\n');
	post_req.write(post_speak_data);
	post_req.end();

		});

		post_req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		accessToken = null;

		});
	});

	post_req.write(post_data);
	post_req.end();
}
