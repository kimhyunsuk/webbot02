﻿var request = require('request-promise');
var util = require('util');


// replace LUIS endpoint with your own 
var luisEndpoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6393ebda-613e-477e-bade-92330e2e496d?subscription-key=9fed2fd1ec614cb58ae1989302151d13&verbose=true';
//var luisEndpoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6393ebda-613e-477e-bade-92330e2e496d?subscription-key=db22f870d1664b19b482faa6d8e53c08&verbose=true';
var luisUrlTemplate = `${luisEndpoint}&q=%s`;

function query(text) {
 	return new Promise((resolve, reject) => {
 		var queryUrl = util.format(luisUrlTemplate, encodeURIComponent(text));
 		//console.log(`invoking LUIS query: ${queryUrl}`);
 		return request(queryUrl)
.then((body) => {
 				var result = JSON.parse(body);
 				console.log(`got LUIS response: ${JSON.stringify(body, true, 2)}`);
 				return resolve(result);

        })
.catch(err => {
 				console.error(`error: ${JSON.stringify(err, true, 2)}`);
 				return reject(err);

        });

    });

}


module.exports = {
 	query 
}; 
