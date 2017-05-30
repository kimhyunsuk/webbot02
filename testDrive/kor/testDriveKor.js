var builder = require('botbuilder');
var stringBuilder = require('stringbuilder');
var query = require('../../config/query');
var date = require('date-utils');
date = new Date();
var data = "";

var query = require('../../config/query');

function create(bot) {
    
    var responseTime;

     bot.dialog('/korTestDriveMain', [                                      //bot.dialog('/korTestDrive start


        

        function (session, args, next) {
            
            var msg = new builder.Message(session)
            .attachments([
            
                new builder.HeroCard(session)
                    .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveTitleName"))
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveSubtitleMessage"))
                    //.text(str)
                    .buttons([
                
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationMessage")),
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "centerCallReservationClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "centerCallReservationMessage"))
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "testDriveMenuList"));

            //facebook 동영상 테스트 START - 장상련 20170525
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
                            { url: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4' }
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, "한국어로 해줘", "한국어"),
                            builder.CardAction.imBack(session, "hey there", "English")
                        ])
                ]);

            session.send(msg);
            //facebook 동영상 테스트 END - 장상련 20170525

            session.endDialog();
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
    
    
    bot.dialog('/korOnlineTestDrive' , [
    
        function (session, args, next) { 
            console.log("sid : " + args.key +" || message : "+ args.sendMsg +"|| begin date : " + args.beginTime + " || intent : "+args.intent);
            //session.send("korOnlineTestDrive session key : " + session.message.sourceEvent.clientActivityId);
            //query.getData(args);
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationWelcomeMessage"));
            
            var onlineReserveCard = new builder.HeroCard(session)
                .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationTitleName"))
                .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationSubtitleMessage"))
                .images([
                    new builder.CardImage(session)
                        .url(img_path + "/images/testDrive/testDriveReservation.jpg")
                        .alt('contoso_flowers')
                        .tap(img_path + "/images/testDrive/testDriveReservation.jpg")
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationUrlClickMessage")),
                ]);
            session.send(new builder.Message(session).addAttachment(onlineReserveCard));
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationEndMessage"));
            
            

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                                    .title("")
                                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceTestDriveToPrice"))
                                    //.text(str)
                                    .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndYesMessage")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);

    /***********************************************************************************
        한국어 시승 - 시승센터 전화 예약 메뉴
    ************************************************************************************/

    bot.dialog('/korNoAreaOfflineTestDrive', [

        function (session, args, next) {
            console.log("sid : " + args.key + " || message : " + args.sendMsg + "|| begin date : " + args.beginTime + " || intent : " + args.intent);
            //session.send(session.message.text);
            var msg = new builder.Message(session)
            .attachments([
            
                new builder.HeroCard(session)
                    .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "centerCallReservationTitleName"))
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "centerCallReservationSubTitleMessage"))
                    //.text(str)
                    .buttons([
                
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoul")),
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "busan")),
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "centerCallReservationMenuList"));
            session.endDialog();

            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
    
    bot.dialog('/korAreaOfflineTestDrive', [
    
        function (session , args, next) {
            
            console.log("sid : " + args.key + " || message : " + args.sendMsg + "|| begin date : " + args.beginTime + " || intent : " + args.intent);
            
            
            
            
            if (session.message.text.match(/서울/g) || session.message.text.match(/Seoul/g)) { 
                
                session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationWelcomeMessage"));
                var msg = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem1"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem1SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/seoul/seongnae.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/seoul/seongnae.png")),
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:1", "Select")
                    ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem2"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem2SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/seoul/jamsil.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/seoul/jamsil.png")),
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:2", "Select")
                    ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem3"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem3SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/seoul/gongnung.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/seoul/gongnung.png"))
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:3", "Select")
                    ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem4"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "seoulCenterCallReservationItem4SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/seoul/mokdong.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/seoul/mokdong.png"))
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:4", "Select")
                    ])
                ]);
            
            } else if (session.message.text.match(/부산/g) || session.message.text.match(/Busan/g) ) { 
            
                session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanCenterCallReservationWelcomeMessage"));
                var msg = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanCenterCallReservationItem1"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanCenterCallReservationItem1SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/busan/busandongbu.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/busan/busandongbu.png")),
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:1", "Select")
                    ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanCenterCallReservationItem2"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "busanCenterCallReservationItem2SubtitmeMessage"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/testDrive/busan/busanjuang.png")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/testDrive/busan/busanjuang.png")),
                    ])
                        .buttons([
                        builder.CardAction.openUrl(session, "http://www.hyundai.com/kr/tdn/index.do", session.localizer.gettext(query.kor_en_Checker(session.message.text), "CenterCallReservationUrlClickMessage"))
                            //,builder.CardAction.imBack(session, "select:2", "Select")
                    ])
                ]);
            }
            session.send(msg);
            
            

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                                    .title("")
                                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceTestDriveToPrice"))
                                    //.text(str)
                                    .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndYesMessage")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            
            session.endDialog();
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
}


module.exports = {
    create
}