var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');
var request = require('request');

var greeting = require('./greeting');
var testDriveKor = require('./testDrive/kor/testDriveKor');
var designKor = require('./design/kor/designKor');
var convenienceKor = require('./convenience/kor/convenienceKor');
var priceKor = require('./price/kor/priceKor');
var query = require('./config/query');


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server   
var server = restify.createServer();
var botenv = process.env.BOT_ENV;

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});


// Create chat bot
var connector = new builder.ChatConnector({
    //appId: process.env.MICROSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: '98ee3e87-b025-4e50-a7b3-1df9e902dacc',
    appPassword: 'aKLgB9zVeiCPRBPObwAvwEr'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

greeting.create(bot);           // 인사
testDriveKor.create(bot);       // 시승
designKor.create(bot);          // 디자인
convenienceKor.create(bot);     // 편의사항
priceKor.create(bot);           // 가격
//=========================================================
// Bots Dialogs
//=========================================================

var app = express();
var fs = require('fs');

app.listen(3303, function () { 
	console.log('Server Start .');
});

app.get('/', function (req, res) {
	fs.readFile('index.html', function (error, data) {
		if (error) {
			console.log(error);
		} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		} 
	});
});
