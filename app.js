var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');
var request = require('request');

//�λ�
var greeting = require('./greeting');
//�ý�
var testDriveKor = require('./testDrive/kor/testDriveKor');
//������
var designKor = require('./design/kor/designKor');
//���ǻ���
var convenienceKor = require('./convenience/kor/convenienceKor');
//����
var priceKor = require('./price/kor/priceKor');



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
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD

});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

//�б��۾��׽�Ʈ 
greeting.create(bot);           // �λ�
testDriveKor.create(bot);       // �ý�
designKor.create(bot);          // ������
convenienceKor.create(bot);     // ���ǻ���
priceKor.create(bot);           // ����


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
