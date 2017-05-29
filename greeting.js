var builder = require('botbuilder');
var request = require('request');

var date = require('date-utils');
date = new Date();
var language = "";

var query = require('./config/query');
var date = require('date-utils');
var stored = require('./config/storedModel');
date = new Date();

var userConversationId = "";
var userAddressId = "";



//이미지경로 전역 변수 선언
global.img_path = 'http://webbot02.azurewebsites.net/hyundai';
global.userId = "";

//DB Config

var async = require('async');
var tp = require('tedious-promises');
var TYPES = require('tedious').TYPES;

var config = {
    server: 'faxtimedb.database.windows.net',
    userName: 'faxtime',
    password: 'test2016!',
    options: {
        debug: {
            packet: false,
            data: false,
            patload: false,
            token: false,
            log: true
        },
        encrypt: true,
        database: 'taihoML'
    }
};





function create(bot) {                                                  // function create(bot) START
    if (!bot) throw new error('bot instance was not provided!!');
    
    var responseTime;
    var languageValue;



    console.log("한글 : "+query.kor_en_Checker("l"));

    console.log("바 : "+query.kor_en_Checker("|")); 

    //incoming
    //bot.on('incoming', function (message) {

    //    var increment = 0;

    //    playAlert = setInterval(function () {

    //        console.log("increment = " + increment);
    //        increment++;
    //        if (increment == 5) {
    //            console.log("5초 지남");
    //        } else if (increment == 10) {
    //            console.log("10초 지남");
    //        } else if (increment == 20) {
    //            console.log("GAME OVER");
    //            clearInterval(playAlert);
    //        }
    //    }, 1000);
    //});

    



    //챗봇 시작시 다이얼로그 출력
    bot.on('conversationUpdate', function (message) {


        if (message.membersAdded && message.membersAdded.length > 0) {
            var membersAdded = message.membersAdded
                    .map(function (m) {
                        var isSelf = m.id === message.address.bot.id;
                        console.log("message.address.bot.id : " + message.address.bot.id);
                        //console.log("message.address.bot.id : " + message.address.conversation.id);
                        return (isSelf ? message.address.bot.name : m.name) || '' + ' (Id: ' + m.id + ')';
                    })
                    .join(', ');
            console.log('56 : ' + membersAdded);
            if (membersAdded == 'Bot' || membersAdded == 'quotationBot') {
                bot.beginDialog(message.address, '/init');
            }
        }
    });


    //초기 출력 화면
    bot.dialog('/init', [
        function (session) {
            console.log("init dialog : " + session.message.address.conversation.id);
            console.log("init dialog : " + session.message.address.id);
            

            console.log(session.localizer);
            console.log("session.preferredLocale()  : " + session.preferredLocale("ko"));


            userConversationId = session.message.address.conversation.id;
            userAddressId = session.message.address.id;

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                    .attachments([
                        new builder.VideoCard(session)
                            .title('그랜다이저')
                            .autostart(true)
                            .subtitle('Grandizer')
                            .text("안녕하세요. 저는 현대자동차의 그랜저 ig를 소개하는 그랜다이저예요. \n\n 대화중 언제든지'그랜다이저' 라고 입력하면 초기 화면으로 돌아가요. \n\n Hi. My name is Grandizer. \n\n At any time, type 'Grandizer' to return to the initial screen. ")
                            .image(builder.CardImage.create(session, img_path + "/images/img_car01.jpg"))
                            //.images([
                            //    builder.CardImage.create(session, img_path + "/images/img_car01.jpg")
                            //])
                            .media([
                                { url: 'https://youtu.be/VQtonf1fv_s?list=PLNSKpl7JCPswwj_fWkfixq5L7QeZJA4Ot' }
                            ])
                            .buttons([
                                builder.CardAction.imBack(session, "한국어로 해줘", "한국어"),
                                builder.CardAction.imBack(session, "hey there", "English")
                            ])
                ]);

            session.send(msg);
            session.endDialog();
        }
    ]);

    //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4e351e9f-d983-4ba7-b575-f78f7ff709a2?subscription-key=9fed2fd1ec614cb58ae1989302151d13&verbose=true');
    //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e120869f-be93-4b48-b8a6-d58b10a63290?subscription-key=7efb093087dd48918b903885b944740c&verbose=true');
    //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/88f5711d-8692-4ab1-8eba-36d285c2d639?subscription-key=9fed2fd1ec614cb58ae1989302151d13&timezoneOffset=0.0&verbose=false&q=');
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/28745440-fd03-4658-b190-9c154fe89d89?subscription-key=7efb093087dd48918b903885b944740c&verbose=true');
    var intents = new builder.IntentDialog({ recognizers: [recognizer] });
    bot.dialog('/', intents);


    //status table 
    intents.onBegin(function (session, args, next) {
        
        console.log( "user insert : " + session.message.text);
        var insert;
        var timer;
        var increment = 0;
        console.log(session.message.address);
        console.log(session.message.address.id); //바뀜
        console.log(session.message.address.conversation.id); //unique


        

        //userAddressId 


        //if ( userConversationId == session.message.address.conversation.id ) {

        //    timer = setInterval(

        //        function () {

        //            console.log("꺼져");

        //    }, 10000);

        //} else {


        //}

        //beforeMsg = session.message.text;

        //    timer = setInterval(

        //        function () {


        //        //    console.log("increment : " + increment);
        //        //    increment++;
        //        //if (session.message.text) {

        //        //    clearInterval(timer);

        //        //}
        //        //else {

        //        //    console.log("꺼져");

        //        //}
        //            console.log("꺼져");
                
        //    }, 10000);
            
        


        //playAlert = setInterval(function () {

        //    console.log("increment = " + increment);
        //    increment++;
        //    if (increment == 5) {
        //        console.log("5초 지남");
        //    } else if (increment == 10) {
        //        console.log("10초 지남");
        //    } else if (increment == 20) {
        //        console.log("GAME OVER");
        //        clearInterval(playAlert);
        //    }
        //}, 1000);

        console.log("session.statusCode : " + session.sessionState.callstack.id);
        
        console.log("session ID : " + session.message.sourceEvent.clientActivityId);
        console.log("channel ID : " + session.message.address.channelId);

        console.log("user ijnput check : " + query.kor_en_Checker(session.message.text));
        


        if (session.message.address.channelId == "skype" || session.message.address.channelId == "facebook" ) {


            var now = new Date();
            userId = now.getFullYear() + ("00" + (now.getMonth() + 1)).slice(-2) + ("00" + now.getDate()).slice(-2) + ("00" + now.getHours()).slice(-2) + ("00" + now.getMinutes()).slice(-2) + ("00" + now.getSeconds()).slice(-2);

        } else { 

            userId = session.message.sourceEvent.clientActivityId.split(".")[0] + "." + session.message.sourceEvent.clientActivityId.split(".")[1];

        }


        //var userId = userId;

        var tasks = [
            function (callback) {
                var returnData;
                tp.setConnectionConfig(config);
                tp.sql("SELECT CASE WHEN MAX(ENTITYSN) IS NOT NULL THEN 'true' "
                    + "ELSE 'false' END AS price "
                    + "FROM TBL_PRICE_ENTITY "
                    + "WHERE replace(@PRICE,' ','') like '%' + ENTITYNAME + '%'"
                    + "AND NOT (replace(@PRICE,' ','') like '%가솔린%' OR replace(@PRICE,' ','') like '%디젤%')"
                )
                    .parameter('PRICE', TYPES.NVarChar, session.message.text)
                    .execute()
                    .then(function (results) {
                        console.log("select tbl_price_entity success!!!!");
                        callback(null, results);
                    }).fail(function (err) {
                        console.log(err);
                    });
            },
            function (callback) {
                tp.sql("SELECT ENGINE_NAME, MODEL_NAME " +
                    "FROM TBL_CUSTOMER_STATUS " +
                    "WHERE USER_ID = @user_id"
                )
                    .parameter('user_id', TYPES.NVarChar, userId)
                    .execute()
                    .then(function (results) {
                        console.log("select tbl_customer_status success!!!!");
                        callback(null, results);
                    }).fail(function (err) {
                        console.log(err);
                    });
            }
        ];

        async.series(tasks, function (err, results) {
            var priceRes;
            var engineName = null;
            var modelName = null;
            var priceMsg;

            console.log("priceT/F : " + results[0][0].price);
            priceRes = results[0][0].price;

            /*
            if (results[1].length > 0) {
                engineName = results[1][0].ENGINE_NAME;
                modelName = results[1][0].MODEL_NAME;

                console.log("engineName : " + results[1][0].ENGINE_NAME);
                console.log("modelName : " + results[1][0].MODEL_NAME);
            }*/

            if (priceRes == 'true') {
                /*
                if (engineName != null && modelName != null && engineName != '' & modelName != '') {
                    priceMsg = engineName + " " + modelName + " " + session.message.text;
                    session.message.text = priceMsg;
                }
                */
                var lastModel = stored.lastmodel();

                if (lastModel != null) {
                    priceMsg = lastModel[0] + " " + session.message.text;
                    session.message.text = priceMsg;
                }
            }

            next();
        });

    });


    intents.matches('No', [

        function (session, args, next) {
            session.beginDialog('/No', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "No", tableNm: "insert_history" });
        }
    ]);

    intents.matches('None', [

        function (session, args, next) {

            var qnaMsg = "";
            var qnaScore = 0;

            // 헤더 부분
            var headers = {
                'Ocp-Apim-Subscription-Key': '7d9d91d741684466bed2e706cfe5421a',
                'Content-Type': 'application/json'
            }

            // 요청 세부 내용
            var options = {
                url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/b9c07815-a65e-410e-98e7-171ff06d5748/generateAnswer',
                method: 'POST',
                headers: headers,
                form: { 'question': session.message.text }
            }

            // 요청 시작 받은값은 body
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    console.log(JSON.parse(body).answer);
                    msg = JSON.parse(body).answer;
                    score = JSON.parse(body).score;
                }
                console.log("qnaMsg : " + qnaMsg);
                //session.beginDialog('/QnA', { qnaResponse: msg, qnaScore: score });
                session.endDialog();
                session.beginDialog('/QnA', { qnaResponse: msg, qnaScore: score , sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "None", tableNm: "insert_history" });
            })
            
        }

    ]);

    
    intents.matches('korReMainMenu', [
        function (session, args, next) {
            session.beginDialog('/korReMainMenu', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korReturnMainMenu", tableNm: "insert_history"});
        }
    ]);


    intents.matches('greeting', [   
        function (session, args, next) {

            console.log("GREETING : " + query.kor_en_Checker(session.message.text));

            if (query.kor_en_Checker(session.message.text) == "Ko") {

                session.beginDialog('/LanguageSelectKorean', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "LanguageSelectKorean", tableNm: "insert_history" });
            } else if (query.kor_en_Checker(session.message.text) == "En") {

                session.beginDialog('/LanguageSelectEnglish', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "LanguageSelectEnglish", tableNm: "insert_history" });
                
            }
            
        }
    ]);

     /*
        시승 INTENT MATCH
    */
    
    intents.matches('korTestDriveMain', [
        function (session, args, next) {
            session.beginDialog('/korTestDriveMain', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korTestDriveMain", tableNm: "insert_history"});
        }
    ]);

    intents.matches('korOnlineTestDrive', [
        function (session, args, next) {
            session.beginDialog('/korOnlineTestDrive', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korOnlineTestDrive", tableNm: "insert_history"});
        }
    ]);

    intents.matches('korNoAreaOfflineTestDrive', [
        function (session, args, next) {
            session.beginDialog('/korNoAreaOfflineTestDrive', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korNoAreaOfflineTestDrive", tableNm: "insert_history" });
        }
    ]);

    intents.matches('korAreaOfflineTestDrive', [
        function (session, args, next) {
            session.beginDialog('/korAreaOfflineTestDrive', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korAreaOfflineTestDrive", tableNm: "insert_history" });
        }
    ]);

    /*
        편의사항 INTENT MATCH
    */

    intents.matches('korConvenienceMain', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceMain', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceMain", tableNm: "insert_history" });
        }
    ]);
    
    intents.matches('korConvenienceInfotainmentList', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceInfotainmentList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceInfotainmentList", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korConvenienceInfotainmentSimple', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceInfotainmentSimple', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceInfotainmentSimple", tableNm: "insert_history" });
        }
    ]);

    intents.matches('korConvenienceSafetyList', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceSafetyList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceSafetyList", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korConvenienceSafetySimple', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceSafetySimple', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceSafetySimple", tableNm: "insert_history" });
        }
    ]);

    intents.matches('korConvenienceSmartsenseList', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceSmartsenseList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceSmartsenseList", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korConvenienceSmartSenseSimple', [
        function (session, args, next) {
            session.beginDialog('/korConvenienceSmartSenseSimple', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korConvenienceSmartSenseSimple", tableNm: "insert_history" });
        }
    ]);

    /*
        디자인 INTENT MATCH
    */

    intents.matches('korDesignMain', [
        function (session, args, next) {
            session.beginDialog('/korDesignMain', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignMain", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignColorList',[
        function (session, args, next) {
            session.beginDialog('/korDesignColorList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignColorList", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectGrandBlue',[
        function (session, args, next) {
            session.beginDialog('/korDesignSelectGrandBlue', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectGrandBlue", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectIonSilver', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectIonSilver', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectIonSilver", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectKakiMetal', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectKakiMetal', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectKakiMetal", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectLunaGray', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectLunaGray', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectLunaGray", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectMidnightBlack', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectMidnightBlack', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectMidnightBlack", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectPanteraGray', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectPanteraGray', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectPanteraGray", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectShadeBronze', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectShadeBronze', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectShadeBronze", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectValentineRed', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectValentineRed', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectValentineRed", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignSelectWhiteCream', [
        function (session, args, next) {
            session.beginDialog('/korDesignSelectWhiteCream', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignSelectWhiteCream", tableNm: "insert_history" });
        }
    ]);

    intents.matches('korDesignExteriorSimple', [
        function (session, args, next) {
            session.beginDialog('/korDesignExteriorSimple', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignExteriorSimple", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignExteriorDetail', [
        function (session, args, next) {
            session.beginDialog('/korDesignExteriorDetail', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignExteriorDetail", tableNm: "insert_history" });
        }
    ]);


    intents.matches('korDesignInteriorSimple', [
        function (session, args, next) {
            session.beginDialog('/korDesignInteriorSimple', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorSimple", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korDesignInteriorDetail', [
        function (session, args, next) {
            session.beginDialog('/korDesignInteriorDetail', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history" });
        }
    ]);
    intents.matches('korCompareModel', [
        function (session, args, next) {
            var messagenospace = session.message.text.replace(/ /gi, '');

            var compare = null;

            var sendPrice = new Array(2);
            var j = 0;

            sendPrice = messagenospace.match(/가솔린2.4프리미엄스페셜|가솔린2.4프리미엄|가솔린2.4모던|가솔린3.0익스클루시브스페셜프리미어인테리어셀렉션|가솔린3.0익스클루시브스페셜|가솔린3.0익스클루시브|가솔린3.3셀러브리티|디젤2.2프리미엄스페셜|디젤2.2프리미엄|디젤2.2모던|가솔린2.4|가솔린3.0|가솔린3.3|디젤2.2|gasoline 2.4premiumspecial|gasoline2.4premium|gasoline2.4modern|gasoline 3.0exclusivespecialpremierinteriorselection|gasoline 3.0exclusivespecial|gasoline 3.0exclusive|gasoline3.3celebrity|diesel2.2premiumspecial|diesel2.2premium|Sedan diesel2.2modern|gasoline2.4|gasoline 3.0|gasoline3.3|diesel2.2/g);

            session.beginDialog('/korCompareModel', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korCompareModel", tableNm: "insert_history", sendPrice });
        }
    ]);

    intents.matches('LanguageSelectEnglish', [
        function (session, args, next) {
            session.beginDialog('/LanguageSelectEnglish');
        }
    ]);

    intents.matches('LanguageSelectKorean', [
        function (session, args, next) {
            session.beginDialog('/LanguageSelectKorean');
        }
    ]);

    intents.onDefault(
        function (session, args, next) {
            var qnaMsg = "";
            var qnaScore = 0;

            // 헤더 부분
            var headers = {
                'Ocp-Apim-Subscription-Key': '7d9d91d741684466bed2e706cfe5421a',
                'Content-Type': 'application/json'
            }

            // 요청 세부 내용
            var options = {
                url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/b9c07815-a65e-410e-98e7-171ff06d5748/generateAnswer',
                method: 'POST',
                headers: headers,
                form: { 'question': session.message.text }
            }

            // 요청 시작 받은값은 body
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    console.log(JSON.parse(body).answer);
                    msg = JSON.parse(body).answer;
                    score = JSON.parse(body).score;
                }
                console.log("qnaMsg : " + qnaMsg);
                //session.beginDialog('/QnA', { qnaResponse: msg, qnaScore: score });
                session.endDialog();
                session.beginDialog('/QnA', { qnaResponse: msg, qnaScore: score , sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "None", tableNm: "insert_history" });
            })
        }
    );


    intents.matches('korOptionAdd', [
        function (session, args, next) {
            session.beginDialog('/korOptionAdd', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korOptionAdd", tableNm: "insert_history" });
        }
    ]);

    intents.matches('korOptionRemove', [
        function (session, args, next) {
            session.beginDialog('/korOptionRemove', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korOptionRemove", tableNm: "insert_history" });
        }
    ]);



    /*
            가격 INTENT MATCH
    */
    intents.matches('korPriceMain', [
        function (session, args, next) {
            var priceMessage = "";

            var engineNameVar = "";
            var modelNameVar = "";
            var modelNumberVar = 0;

            console.log("args.entities : " + session.message.text);
            //priceMessage = session.message.text.split(" ");
            priceMessage = session.message.text;

            if (priceMessage.match(/가솔린 2.4/g) || priceMessage.match(/가솔린2.4/g) || priceMessage.match(/2.4/g)) {
                console.log("가솔린 2.4");
                engineNameVar = "가솔린 2.4";
                if (priceMessage.match(/모던/g) || priceMessage.match(/모 던/g)) {
                    console.log("모던");

                    modelNameVar = "모던";
                    modelNumberVar = 1;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던" });
                    } 

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", carPrice: 30550000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", carPrice: 30550000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/앞좌석통풍/) || priceMessage.match(/앞좌석 통풍/) || priceMessage.match(/앞 좌석 통풍/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", carPrice: 30550000, selectOption1: "앞좌석 통풍 + 하이패스 시스템", optionPrice1: 600000 });
                    } else if (priceMessage.match(/하이패스 시스템/) || priceMessage.match(/하이패스시스템/) || priceMessage.match(/하이 패스 시스템/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", carPrice: 30550000, selectOption1: "앞좌석 통풍 + 하이패스 시스템", optionPrice1: 600000 });
                    } else if (priceMessage.match(/현대스마트센스패키지IV/) || priceMessage.match(/현대 스마트센스패키지IV/) || priceMessage.match(/현대 스마트 센스패키지IV/) || priceMessage.match(/현대 스마트 센스 패키지IV/) || priceMessage.match(/현대 스마트 센스 패키지 IV/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", carPrice: 30550000, selectOption1: "현대 스마트 센스 패키지IV", optionPrice1: 18000000 });
                    }

                    else {
                        // 모던만 나오게 
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던" });
                    }


                } else if (priceMessage.match(/프리미엄 스페셜/g) || priceMessage.match(/프리미엄스페셜/g)) {

                    modelNameVar = "프리미엄 스페셜";
                    modelNumberVar = 3;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄 스페셜" });
                    }
                    
                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지II/) || priceMessage.match(/현대 스마트센스패키지II/) || priceMessage.match(/현대 스마트 센스패키지II/) || priceMessage.match(/현대 스마트 센스 패키지II/) || priceMessage.match(/현대 스마트 센스 패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "현대 스마트 센스 패키지II", optionPrice1: 1600000 });
                    } else if (priceMessage.match(/익스테리어패키지II/) || priceMessage.match(/익스테리어 패키지II/) || priceMessage.match(/익스테리어 패키지 II/) || priceMessage.match(/익스테리어패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "익스테리어 패키지II", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/JBL사운드패키지/) || priceMessage.match(/JBL 사운드패키지/) || priceMessage.match(/JBL 사운드 패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "JBL 사운드 패키지", optionPrice1: 1150000 });
                    } else if (priceMessage.match(/어라운드뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터 (AVM)/) ) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "어라운드 뷰 모니터(AVM)", optionPrice1: 1200000 });
                    }

                    else {
                        // 프리미엄 스페셜만 나오게 
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄 스페셜" });
                    }
                } else if (priceMessage.match(/프리미엄/)) {

                    modelNameVar = "프리미엄";
                    modelNumberVar = 2;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄", carPrice: 33750000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄", carPrice: 33750000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄", carPrice: 33750000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지I/) || priceMessage.match(/현대 스마트센스패키지I/) || priceMessage.match(/현대 스마트 센스패키지I/) || priceMessage.match(/현대 스마트 센스 패키지I/) || priceMessage.match(/현대 스마트 센스 패키지 I/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄", carPrice: 33750000, selectOption1: "현대 스마트 센스 패키지I", optionPrice1: 1500000 });
                    } else if (priceMessage.match(/익스테리어패키지I/) || priceMessage.match(/익스테리어 패키지I/) || priceMessage.match(/익스테리어 패키지 I/) || priceMessage.match(/익스테리어패키지 I/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄", carPrice: 33750000, selectOption1: "익스테리어 패키지I", optionPrice1: 1500000 });
                    }

                    else {
                        // 프리미엄만 나오게 
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 2.4", trim: "프리미엄" });
                    }

                } 
                else {
                    //가솔린 2.4만 나오게
                    session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 2.4" });
                }
            } else if (priceMessage.match(/가솔린 3.0/) || priceMessage.match(/가솔린3.0/)) {

                engineNameVar = "가솔린 3.0";

                if (priceMessage.match(/익스클루시브 스페셜/) || priceMessage.match(/익스클루시브스페셜/)) {

                    modelNameVar = "익스클루시브 스페셜";
                    modelNumberVar = 5;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지II/) || priceMessage.match(/현대 스마트센스패키지II/) || priceMessage.match(/현대 스마트 센스패키지II/) || priceMessage.match(/현대 스마트 센스 패키지II/) || priceMessage.match(/현대 스마트 센스 패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "현대 스마트 센스 패키지II", optionPrice1: 1600000 });
                    } else if (priceMessage.match(/JBL사운드패키지/) || priceMessage.match(/JBL 사운드패키지/) || priceMessage.match(/JBL 사운드 패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "JBL 사운드 패키지", optionPrice1: 1150000 });
                    } else if (priceMessage.match(/프리미어인테리어셀렉션/) || priceMessage.match(/프리미어 인테리어셀렉션/) || priceMessage.match(/프리미어 인테리어 셀렉션/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "프리미어 인테리어 셀렉션", optionPrice1: 1500000 });
                    }
                    else {
                        // 익스클루시브 스페셜만 나오게 
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜" });
                    }
                }else if (priceMessage.match(/익스클루시브/)) {

                    modelNameVar = "익스클루시브";
                    modelNumberVar = 4;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지II/) || priceMessage.match(/현대 스마트센스패키지II/) || priceMessage.match(/현대 스마트 센스패키지II/) || priceMessage.match(/현대 스마트 센스 패키지II/) || priceMessage.match(/현대 스마트 센스 패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "현대 스마트 센스 패키지II", optionPrice1: 1600000 });
                    } else if (priceMessage.match(/익스테리어패키지II/) || priceMessage.match(/익스테리어 패키지II/) || priceMessage.match(/익스테리어 패키지 II/) || priceMessage.match(/익스테리어패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "익스테리어 패키지II", optionPrice1: 1600000 });
                    } else if (priceMessage.match(/어라운드뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터 (AVM)/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "어라운드 뷰 모니터(AVM)+스마트 전동식 트렁크", optionPrice1: 1200000 });
                    } else if (priceMessage.match(/스마트전동식트렁크/) || priceMessage.match(/스마트 전동식트렁크/) || priceMessage.match(/스마트 전동식 트렁크/) || priceMessage.match(/스마트전동식 트렁크/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브", carPrice: 35500000, selectOption1: "어라운드 뷰 모니터(AVM)+스마트 전동식 트렁크", optionPrice1: 1200000 });
                    }
                    else {
                        // 익스클루시브 만 나오게 
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브" });
                    }
                } 
                else {
                    //가솔린 3.0만 나오게
                    session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 3.0" });
                }

            } else if (priceMessage.match(/가솔린 3.3/) || priceMessage.match(/가솔린3.3/)) {

                engineNameVar = "가솔린 3.3";

                if (priceMessage.match(/셀러브리티/)) {

                    modelNameVar = "셀러브리티";
                    modelNumberVar = 7;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티", carPrice: 38700000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티", carPrice: 38700000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티", carPrice: 38700000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지II/) || priceMessage.match(/현대 스마트센스패키지II/) || priceMessage.match(/현대 스마트 센스패키지II/) || priceMessage.match(/현대 스마트 센스 패키지II/) || priceMessage.match(/현대 스마트 센스 패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티", carPrice: 38700000, selectOption1: "현대 스마트 센스 패키지II", optionPrice1: 1600000 });
                    }
                    else {
                        // 셀러브리티만 나오게
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 3.3", trim: "셀러브리티" });
                    }
                } else {
                    //가솔린 3.3만 나오게
                    session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "가솔린 3.3" });
                }
            } else if (priceMessage.match(/디젤 2.2/) || priceMessage.match(/디젤2.2/)) {

                engineNameVar = "디젤 2.2";

                if (priceMessage.match(/모던/)) {

                    modelNameVar = "모던";
                    modelNumberVar = 8;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "모던" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "모던" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "모던", carPrice: 33550000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "모던", carPrice: 33550000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/앞좌석통풍/) || priceMessage.match(/앞좌석 통풍/) || priceMessage.match(/앞 좌석 통풍/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "모던", carPrice: 33550000, selectOption1: "앞좌석 통풍 + 하이패스 시스템", optionPrice1: 600000 });
                    } else if (priceMessage.match(/하이패스 시스템/) || priceMessage.match(/하이패스시스템/) || priceMessage.match(/하이 패스 시스템/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "모던", carPrice: 33550000, selectOption1: "앞좌석 통풍 + 하이패스 시스템", optionPrice1: 600000 });
                    } else if (priceMessage.match(/현대스마트센스패키지IV/) || priceMessage.match(/현대 스마트센스패키지IV/) || priceMessage.match(/현대 스마트 센스패키지IV/) || priceMessage.match(/현대 스마트 센스 패키지IV/) || priceMessage.match(/현대 스마트 센스 패키지 IV/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "모던", carPrice: 33550000, selectOption1: "현대 스마트 센스 패키지IV", optionPrice1: 18000000 });
                    }
                    else {
                        // 디젤 2.2 모던만 나오게
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "디젤 2.2", trim: "모던" });
                    }
                } else if (priceMessage.match(/프리미엄 스페셜/g) || priceMessage.match(/프리미엄스페셜/g)) {

                    modelNameVar = "프리미엄 스페셜";
                    modelNumberVar = 10;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄 스페셜" });
                    }

                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지II/) || priceMessage.match(/현대 스마트센스패키지II/) || priceMessage.match(/현대 스마트 센스패키지II/) || priceMessage.match(/현대 스마트 센스 패키지II/) || priceMessage.match(/현대 스마트 센스 패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "현대 스마트 센스 패키지II", optionPrice1: 1600000 });
                    } else if (priceMessage.match(/익스테리어패키지II/) || priceMessage.match(/익스테리어 패키지II/) || priceMessage.match(/익스테리어 패키지 II/) || priceMessage.match(/익스테리어패키지 II/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "익스테리어 패키지II", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/JBL사운드패키지/) || priceMessage.match(/JBL 사운드패키지/) || priceMessage.match(/JBL 사운드 패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "JBL 사운드 패키지", optionPrice1: 1150000 });
                    } else if (priceMessage.match(/어라운드뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터(AVM)/) || priceMessage.match(/어라운드 뷰 모니터 (AVM)/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜", carPrice: 31750000, selectOption1: "어라운드 뷰 모니터(AVM)", optionPrice1: 1200000 });
                    } else {
                        // 디젤 2.2 프리미엄 스페셜만 나오게
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄스페셜" });
                    }
                } else if (priceMessage.match(/프리미엄/)) {

                    modelNameVar = "프리미엄";
                    modelNumberVar = 9;

                    if (priceMessage.match(/기본 품목/) || priceMessage.match(/기본품목/) || priceMessage.match(/기본 옵션/) || priceMessage.match(/기본옵션/)) {
                        session.beginDialog('/korPriceBasicOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceBasicOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄" });
                    }
                    
                    else if (priceMessage.match(/선택 품목/) || priceMessage.match(/선택품목/) || priceMessage.match(/선택 옵션/) || priceMessage.match(/선택 옵션/)) {
                        session.beginDialog('/korPriceSelectOptionList', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceSelectOptionList", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄" });
                    } else if (priceMessage.match(/파노라마 썬루프/) || priceMessage.match(/파노라마썬루프/)) {
                        //session.beginDialog('/korPriceSelectOptionItem', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 2.4", trim: "모던", selectOption1: "파노라마 썬루프" });
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄", carPrice: 34750000, selectOption1: "파노라마 썬루프", optionPrice1: 1100000 });
                    } else if (priceMessage.match(/TUIX 컴포트 패키지/) || priceMessage.match(/TUIX 컴포트패키지/) || priceMessage.match(/TUIX컴포트패키지/) || priceMessage.match(/튜익스 컴포트 패키지/) || priceMessage.match(/튜익스 컴포트패키지/) || priceMessage.match(/튜익스컴포트패키지/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄", carPrice: 34750000, selectOption1: "TUIX 컴포트 패키지", optionPrice1: 780000 });
                    } else if (priceMessage.match(/헤드업디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이(HUD)/) || priceMessage.match(/헤드업 디스플레이 (HUD)/) || priceMessage.match(/헤드업디스플레이/) || priceMessage.match(/헤드업 디스플레이/) || priceMessage.match(/HUD/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄", carPrice: 34750000, selectOption1: "헤드업 디스플레이(HUD)", optionPrice1: 1000000 });
                    } else if (priceMessage.match(/현대스마트센스패키지I/) || priceMessage.match(/현대 스마트센스패키지I/) || priceMessage.match(/현대 스마트 센스패키지I/) || priceMessage.match(/현대 스마트 센스 패키지I/) || priceMessage.match(/현대 스마트 센스 패키지 I/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄", carPrice: 34750000, selectOption1: "현대 스마트 센스 패키지I", optionPrice1: 1500000 });
                    } else if (priceMessage.match(/익스테리어패키지I/) || priceMessage.match(/익스테리어 패키지I/) || priceMessage.match(/익스테리어 패키지 I/) || priceMessage.match(/익스테리어패키지 I/)) {
                        session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄", carPrice: 34750000, selectOption1: "익스테리어 패키지I", optionPrice1: 1500000 });
                    }
                    else {
                        // 디젤 2.2 프리미엄만 나오게
                        session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "디젤 2.2", trim: "프리미엄" });
                    }
                } else {
                    // 디젤 2.2만 나오게
                    session.beginDialog('/korPriceTrim', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceTrim", tableNm: "insert_history", model: "디젤 2.2" });
                }
            } else {
                session.beginDialog('/korPriceModel', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceModel", tableNm: "insert_history" });

            }
            session.endDialog();

            // TBL_CUSTOMER_STATUS merge
            console.log("userID : " + userId);
            console.log("engineNameVar : " + engineNameVar);
            console.log("modelNameVar : " + modelNameVar);
            console.log("modelNumberVar : " + modelNumberVar);


            var statusTask = [
                function (callback) {
                    var returnData;
                    tp.setConnectionConfig(config);
                    tp.sql("MERGE TBL_CUSTOMER_STATUS AS A "
                        + "USING (SELECT @userID USER_ID, @engineNm ENGINE_NAME, @modelNm MODEL_NAME) AS B "
                        + "ON (A.USER_ID = B.USER_ID ) "
                        + "WHEN MATCHED THEN "
                        + "UPDATE SET MODEL_NAME = B.MODEL_NAME, A.USER_ID = B.USER_ID, A.ENGINE_NAME = B.ENGINE_NAME "
                        + "WHEN NOT MATCHED THEN  "
                        + "INSERT (USER_ID, ENGINE_NAME, MODEL_NAME, LAST_REG_DATE) "
                        + "VALUES (B.USER_ID, B.ENGINE_NAME, B.MODEL_NAME,  CONVERT(VARCHAR, DATEADD(Hour, 9,GETDATE()), 101)+' '+CONVERT(VARCHAR, DATEADD(Hour, 9,GETDATE()), 24)); "
                    )

                        .parameter('userID', TYPES.NVarChar, userId)
                        .parameter('engineNm', TYPES.NVarChar, engineNameVar)
                        .parameter('modelNm', TYPES.NVarChar, modelNameVar)
                        .execute()
                        .then(function (results) {
                            console.log("TBL_CUSTOMER_STATUS Merge Success!!!!");
                            callback(null, results);
                        }).fail(function (err) {
                            console.log(err);
                        });
                }
            ];

            async.series(statusTask, function (err, results) {

                var statusMerge;
                
                console.log("Merge Result : " + results[0]);
            });

            if (modelNumberVar != 0)
            {
                var customerSelectTask = [
                    function (callback) {
                        var returnData;
                        tp.setConnectionConfig(config);
                        tp.sql("INSERT INTO TBL_MODEL_CUSTOMER_SELECTED (USER_ID, MODEL_NUMBER) "
                            + "VALUES (@userID, @modelNumber )  "
                        )

                        tp.sql("MERGE TBL_MODEL_CUSTOMER_SELECTED AS A "
                            + "USING (SELECT @userID USER_ID, @modelNumber MODEL_NUMBER ) AS B "
                            + "ON (A.USER_ID = B.USER_ID AND A.MODEL_NUMBER = B.MODEL_NUMBER) "
                            + "WHEN MATCHED THEN "
                            + "UPDATE SET MODEL_NUMBER = B.MODEL_NUMBER, A.USER_ID = B.USER_ID "
                            + "WHEN NOT MATCHED THEN  "
                            + "INSERT (USER_ID, MODEL_NUMBER ) "
                            + "VALUES (B.USER_ID, B.MODEL_NUMBER ); "
                        )



                            .parameter('userID', TYPES.NVarChar, userId)
                            .parameter('modelNumber', TYPES.Int, modelNumberVar)
                            .execute()
                            .then(function (results) {
                                console.log("TBL_MODEL_CUSTOMER_SELECTED Insert Success!!!!");
                                callback(null, results);
                            }).fail(function (err) {
                                console.log(err);
                            });
                    }
                ];
                async.series(customerSelectTask, function (err, results) {

                    var statusMerge;

                    console.log("Insert Result : " + results[0]);
                });


            }




        }
    ]);

    /*
        가격 비교 INTENT MATCH
    */
    intents.matches('korCompareBeforeModel', [
        function (session, args, next) {
            var messagenospace = session.message.text.replace(/ /gi, '');
            var compare = null;

            var sendPrice = new Array(2);
            var j = 0;

            /*
            for (var i = 0; i < args.entities.length; i++) {
                if (args.entities[i].type.indexOf("상세모델명") != -1) {
                    if (compare == null) {
                        compare = args.entities[i].entity;
                    }
                }
            }
            */


            var beforModelTasks = [
                function (callback) {
                    tp.setConnectionConfig(config);
                    tp.sql("SELECT TOP 1 SID, USER_ID, MODEL_NUMBER " +
                        "FROM TBL_MODEL_CUSTOMER_SELECTED " +
                        "WHERE USER_ID = @userId " +
                        "ORDER BY SID DESC"
                    )
                        .parameter("userId", TYPES.NVarChar, userId)
                        .execute()
                        .then(function (results) {
                            console.log("tbl_model_customer_selected select Success!!!!");
                            console.log(results);
                            callback(null, results);
                        }).fail(function (err) {
                            console.log(err);
                        });
                },
                function (data, callback) {

                    if (data.length > 0 && data[0].MODEL_NUMBER != null && data[0].MODEL_NUMBER != 0) {

                        tp.setConnectionConfig(config);
                        tp.sql("SELECT CAR_TYPE, CAR_TYPE_ENG " +
                            "FROM TBL_CAR_TYPE " +
                            "WHERE SID = @sid"
                        )
                            .parameter("sid", TYPES.Int, data[0].MODEL_NUMBER)
                            .execute()
                            .then(function (results) {
                                console.log("TBL_CAR_TYPE select Success!!!!");
                                callback(null, results);
                            }).fail(function (err) {
                                console.log(err);
                            });

                    } else {
                        callback(null, "");
                    }

                }

            ];

            async.waterfall(beforModelTasks, function (err, results) {
                console.log("Insert Result : " + results);

                sendPrice = messagenospace.match(/가솔린2.4프리미엄스페셜|가솔린2.4프리미엄|가솔린2.4모던|가솔린3.0익스클루시브스페셜프리미어인테리어셀렉션|가솔린3.0익스클루시브스페셜|가솔린3.0익스클루시브|가솔린3.3셀러브리티|디젤2.2프리미엄스페셜|디젤2.2프리미엄|디젤2.2모던|가솔린2.4|가솔린3.0|가솔린3.3|디젤2.2|gasoline 2.4premiumspecial|gasoline2.4premium|gasoline2.4modern|gasoline 3.0exclusivespecialpremierinteriorselection|gasoline 3.0exclusivespecial|gasoline 3.0exclusive|gasoline3.3celebrity|diesel2.2premiumspecial|diesel2.2premium|Sedan diesel2.2modern|gasoline2.4|gasoline 3.0|gasoline3.3|diesel2.2/g);

                if (results.length > 0) {
                    var carType = results[0].CAR_TYPE.replace("그랜저IG 자가용 ", "");
                    sendPrice[1] = carType;
                } else {
                    sendPrice[1] = null;
                }

                session.beginDialog('/korCompareModel', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korCompareBeforeModel", tableNm: "insert_history", sendPrice });

            });

        }
    ]);

    intents.matches('korCompareBeforeModels', [
        function (session, args, next) {
            var sid = "";
            var sendPrice = new Array(2);

            var beforModelsTasks = [
                function (callback) {
                    tp.setConnectionConfig(config);
                    tp.sql("SELECT TOP 2 SID, USER_ID, MODEL_NUMBER " +
                        "FROM TBL_MODEL_CUSTOMER_SELECTED " +
                        "WHERE USER_ID = @userId " +
                        "ORDER BY SID DESC"
                    )
                        .parameter("userId", TYPES.NVarChar, userId)
                        .execute()
                        .then(function (results) {
                            callback(null, results);
                        }).fail(function (err) {
                            console.log(err);
                        })
                },
                function (data, callback) {

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].MODEL_NUMBER != null) {
                            sid += data[i].MODEL_NUMBER +",";
                        }
                    }

                    sid = sid.slice(0, -1);


                    if (data.length > 0 && data[0].MODEL_NUMBER != null && data[0].MODEL_NUMBER != 0) {

                        tp.setConnectionConfig(config);
                        tp.sql("SELECT CAR_TYPE, CAR_TYPE_ENG " +
                            "FROM TBL_CAR_TYPE " +
                            "WHERE convert(varchar(20), SID) in (" + sid + ")"
                        )
                            .execute()
                            .then(function (results) {
                                callback(null, results);
                            }).fail(function (err) {
                                console.log(err);
                            });
                    } else {
                        callback(null, "");
                    }
                }
            ];

            async.waterfall(beforModelsTasks, function (err, results) {

                if (results.length > 1) {
                    sendPrice[0] = results[0].CAR_TYPE.replace("그랜저IG 자가용 ", "");
                    sendPrice[1] = results[1].CAR_TYPE.replace("그랜저IG 자가용 ", "");
                }

                session.beginDialog('/korCompareModel', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korCompareBeforeModels", tableNm: "insert_history", sendPrice });

            });

        }
    ]);


    /***********************************************************************************
        한국어 메뉴 초기화면
    ************************************************************************************/
    //bot.dialog('/korMenu' start
    bot.dialog('/korMenu', [                                        

        function (session, args, next) {
            //console.log("message : " + args.sendMsg + "|| begin date : " + date.getTime());
            console.log('img_path  : ' + img_path);
            var msg = new builder.Message(session)
                .attachments([

                    new builder.HeroCard(session)
                        .title("그랜다이저")
                        .text("원하시는 메뉴를 \n\n 선택하시거나 질문해주세요!!")
                        .buttons([
                            builder.CardAction.imBack(session, "가격 보여줘", "가격"),
                            builder.CardAction.imBack(session, "디자인 보여줘", "디자인"),
                            builder.CardAction.imBack(session, "편의사항 보여줘", "편의사항"),
                            builder.CardAction.imBack(session, "시승 보여줘", "시승")
                        ])
                ]);
                
                builder.Prompts.choice(session, msg, '가격|디자인|편의사항|시승');
                session.endDialog();
                
                responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
                query.insertHistoryQuery(args, responseTime, function (err, result) {
                    if (!err) {
                        console.log("query.getData : " + result);
                    }
                });
        }

    ]).reloadAction('reloadMenu', null, { matches: /^그랜다이저/i });

    //bot.dialog('/korMenu' end


    /***********************************************************************************
        영어 초기 메뉴
    ************************************************************************************/

    bot.dialog('/No', [

        function (session, args, next) {

            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "NoMessage"));
            session.endDialog();
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }

    ])

    bot.dialog('/EngMenu', [

        function (session, args, next) {

            session.send("Hi!! I`m Hyundai Motors ChatBot  Grandizer!!");
            builder.Prompts.choice(session, 'What do you want menu? choice or typing!!', 'testDrive|Design|Convenience|Price', { listStyle: builder.ListStyle.button });

        }


    ]);

    //bot.dialog('/korReMainMenu', [

    //    function (session, args, next) {
    //        //console.log("message : " + args.sendMsg + "|| begin date : " + date.getTime());
    //        console.log('img_path  : ' + img_path);
    //        var msg = new builder.Message(session)
    //            .attachments([

    //                new builder.HeroCard(session)
    //                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "returnMainMenuMessage"))//"원하시는 메뉴를 \n\n 선택하시거나 질문해주세요!!")
    //                    .buttons([
    //                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
    //                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
    //                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
    //                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive")),
    //                    ])
    //            ]);
    //        //session.send(msg);
    //        //var msg1 = new builder.Message(session)
    //        //    .attachments([

    //        //        new builder.HeroCard(session)
    //        //            .buttons([
    //        //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
    //        //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
    //        //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
    //        //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive")),
    //        //            ])
    //        //    ]);

    //        builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "initMenuList"));
    //        session.endDialog();
    //    }

    //]).reloadAction('reloadMenu', null, { matches: /^그랜다이저/i });



    bot.dialog('/korReMainMenu', [

        function (session, args, next) {
            //console.log("message : " + args.sendMsg + "|| begin date : " + date.getTime());
            console.log('img_path  : ' + img_path);
            var msg = new builder.Message(session)
                .attachments([

                    new builder.HeroCard(session)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "returnMainMenuMessage"))//"원하시는 메뉴를 \n\n 선택하시거나 질문해주세요!!")
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceModelCall")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No")),
                            
                        ])
                ]);
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //    .attachments([

            //        new builder.HeroCard(session)
            //            .buttons([
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive")),
            //            ])
            //    ]);

            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "initMenuList"));
            session.endDialog();
        }

    ]);

    bot.dialog('/QnA', [

        function (session, args, next) {
            var responseTime;
            console.log("args : " + args);
            if (args.qnaScore > 80) {
                session.send(args.qnaResponse);
            }
            else {
                session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "unknownMessage"));
            }
            session.endDialog();  
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });          
        }
    ]);

    bot.dialog('/LanguageSelectKorean', [

        function (session, args, next) {
            session.preferredLocale('Ko', function (err) {
                if (err) {
                    session.error(err);
                }
            });
            var msg = new builder.Message(session)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "name"))
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "welcomeMessage"))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive"))
                        ])
                ]);
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //    .attachments([
            //        new builder.HeroCard(session)
            //            .buttons([
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive"))
            //            ])
            //    ]);
            console.log('110 : ' + session.localizer.gettext(query.kor_en_Checker(session.message.text), "name"));
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "initMenuList"));
            session.endDialog();             
        }
    ]);
 
    bot.dialog('/LanguageSelectEnglish', [

        function (session, args, next) {

            var Lang = "";
            console.log("session.message.text : " + session.message.text);
            if (query.kor_en_Checker(session.message.text) == "En") {

                Lang = "En";

            }
            else if (query.kor_en_Checker(session.message.text) == "Kr") {

                Lang = "Kr";
            }

            console.log("LANG : " + Lang);

            session.preferredLocale('En', function (err) {
                if (err) {
                    session.error(err);
                }
            });
            var msg = new builder.Message(session)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(Lang, "name"))
                        .text(session.localizer.gettext(Lang, "welcomeMessage"))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(Lang, "priceClickMessage"), session.localizer.gettext(Lang, "price")),
                            builder.CardAction.imBack(session, session.localizer.gettext(Lang, "designClickMessage"), session.localizer.gettext(Lang, "design")),
                            builder.CardAction.imBack(session, session.localizer.gettext(Lang, "convenienceClickMessage"), session.localizer.gettext(Lang, "convenience")),
                            builder.CardAction.imBack(session, session.localizer.gettext(Lang, "testDriveClickMessage"), session.localizer.gettext(Lang, "testDrive"))
                        ])

                        //.title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "name"))
                        //.text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "welcomeMessage"))
                        //.buttons([
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive"))
                        //])
                ]);
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //    .attachments([
            //        new builder.HeroCard(session)
            //            .buttons([
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "price")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "design")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenience")),
            //                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDrive"))
            //            ])
            //    ]);
            console.log('110 : ' + session.localizer.gettext(Lang, "name"));
            builder.Prompts.choice(session, msg, session.localizer.gettext(Lang, "initMenuList"));
            session.endDialog();            
        }
    ]);
    
}   // function create(bot) END




module.exports = {
    create
}
