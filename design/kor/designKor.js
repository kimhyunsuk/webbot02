var builder = require('botbuilder');
var query = require('../../config/query');
var date = require('date-utils');
date = new Date();
var query = require('../../config/query');
function create(bot) {
    
    var responseTime;

    /***********************************************************************************
    1. 한국어 디자인 초기 메뉴
    ************************************************************************************/
    bot.dialog('/korDesignMain', [

        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "designMainMessage")); 

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                //.attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "designTitleName"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "designSubtitleMessage"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/20170302091059771443.jpg")
                        ])
                        .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/20170302091059771443.jpg"))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "color")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "interior")),
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "exterior"))
                        ])
                        //.buttons([
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "color")),
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "interior")),
                        //    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "exterior"))
                        //])
            ]);
            
            //session.send(msg);

            //var msg1 = new builder.Message(session)
            //    .textFormat(builder.TextFormat.xml)
            //    //.attachmentLayout(builder.AttachmentLayout.carousel)
            //    .attachments([
            //        //AnimationCard
            //    new builder.HeroCard(session)
            //    //        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "designTitleName"))
            //    //        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "designSubtitleMessage"))
            //    //        .images([
            //    //    builder.CardImage.create(session, img_path + "/images/carDesign/20170302091059771443.jpg")
            //    //])
            //            .buttons([
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "color")),
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "interior")),
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "exterior"))
            //    ])
            //]);

            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "designMenuList")); 
            session.endDialog();
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);


    //색상 선택
    bot.dialog('/korDesignColorList', [

        function (session, args) {
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelectWelcomeMessage")); 
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.VideoCard(session)
                            .title('그랜다이저')
                            .autostart(true)
                            .subtitle('Grandizer')
                            .text('test')
                            .media([
                        { url: 'https://youtu.be/VQtonf1fv_s?list=PLNSKpl7JCPswwj_fWkfixq5L7QeZJA4Ot' }
                    ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/WC9/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))
                                
                        ])
                        //.tap(builder.CardAction.openUrl(session, "https://youtu.be/VQtonf1fv_s?list=PLNSKpl7JCPswwj_fWkfixq5L7QeZJA4Ot", session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationUrlClickMessage")))
                        //.tap(builder.CardAction.openUrl(session, "https://codyhouse.co/demo/360-degrees-product-viewer/index.html", session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationUrlClickMessage")))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCreamCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/N9V/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                                
                        ])
                        //.tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/N9V/00060.jpg"))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilverCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/U9G/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                                //.tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/U9G/00060.jpg"))
                        ])
                        //.tap(builder.CardAction.openUrl(session, "https://youtu.be/VQtonf1fv_s?list=PLNSKpl7JCPswwj_fWkfixq5L7QeZJA4Ot", session.localizer.gettext(query.kor_en_Checker(session.message.text), "onlineReservationUrlClickMessage")))
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGrayCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/PG9/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/PG9/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGrayCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))

                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NB9/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NB9/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlackCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/V9R/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/V9R/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRedCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NU9/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NU9/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlueCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/S9C/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/S9C/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronzeCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal")) 
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/TK9/00060.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/TK9/00060.jpg"))
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetalCilckMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorSelect"))
                        ])
                ]);

            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorMenuList"));
            session.endDialog();
           
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);

    // 차 외관 선택
    bot.dialog('/korDesignExteriorSimple', [

        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorMainMessage")); 

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorTitleName"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorSubtitleMessage"))
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorTextMessage"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/car_outside_title.jpg")
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetail"))
                        ])
            ]);
            
            //session.send(msg);

            //var msg1 = new builder.Message(session)
            //    .textFormat(builder.TextFormat.xml)
            //    .attachments([
            //    new builder.HeroCard(session)
            //    .buttons([
            //         builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetail"))
            //    ])
            //]);
           
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorMenuList"));
            session.endDialog();
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
           
        }
    ]);
    
    
    bot.dialog('/korDesignExteriorDetail', [
    
        function (session, args, results) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailMessage")); 

            //if (results.response.entity == "외관상세") {
                var msg1 = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    //.title("그랜저의 외관입니다.")
                    .attachments([
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailItem1"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/20161122093146198083.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/20161122093146198083.jpg"))
                    ]),
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailItem2"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/20161122093251750084.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/20161122093251750084.jpg"))
                    ]),
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailItem3"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/20161122093309923085.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/20161122093309923085.jpg"))
                    ]),
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "exteriorDetailItem4"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/20161122093331472086.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/20161122093331472086.jpg"))
                    ])
                ]);
                
            session.send(msg1);
           
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
           
            var msg = new builder.Message(session)
                    .attachments([
            
                new builder.HeroCard(session)
                            .title("")
                            .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceExteriorDesignToConvenience"))
                            .buttons([
                                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                                builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                            ])
            ]);
            
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //        .attachments([
            
            //    new builder.HeroCard(session)
            //                .buttons([
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
            //    ])
            //]);

            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();
        }
        //, function (session, results) { 
        
        //    console.log("AAAA : " + session.message.text);
        //    session.endDialog();
        //}

    ]);



    // 차 내관 선택
    bot.dialog('/korDesignInteriorSimple', [

        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorMainMessage")); 

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachments([
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorTitleName"))
                        .subtitle(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorSubtitleMessage"))
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorTextMessage"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/car_inside_title.jpg")
                        ])
                        .buttons([
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetailClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetail"))
                        ])
            ]);
            
            //session.send(msg);            
            
            //var msg1 = new builder.Message(session)
            //    .textFormat(builder.TextFormat.xml)
            //    .attachments([
            //    new builder.HeroCard(session)
            //            .buttons([
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetailClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetail"))
            //    ])
            //]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorMenuList"));
            session.endDialog();
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
        
        
    bot.dialog('/korDesignInteriorDetail', [
    
        function (session, args, results) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetailMessage")); 

            //if (results.response.entity == "내관상세") {
                var msg1 = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments([
                        //AnimationCard
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetailItem1"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/car_inside_detail_front.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/car_inside_detail_front.jpg"))
                    ]),
                    new builder.HeroCard(session)
                            .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "interiorDetailItem2"))
                            .images([
                        builder.CardImage.create(session, img_path + "/images/carDesign/car_inside_detail_back.jpg")
                                    .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/car_inside_detail_back.jpg"))
                    ]),
                ]);
                
            session.send(msg1);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                    .title("")
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceInteriorDesignToConvenience"))
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                    ])
                ]);
            
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //        .attachments([
            
            //    new builder.HeroCard(session)
            //                .buttons([
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
            //    ])
            //]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();
        }
    ]);
     


    /***********************************************************************************
    1. 한국어 디자인 - 색상 세부 목록
    ************************************************************************************/


    //화이트 크림 색상
    bot.dialog('/korDesignSelectWhiteCream', [
        function (session, args) {
            
            //session.send("화이트 크림 색상의 정면 | 좌측면 | 우측면 | 후면 모습입니다.");
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream")+" "+ session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                //.title("화이트크림")
                .attachments([
                    //AnimationCard
                new builder.HeroCard(session)

                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/WC9/00055.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/WC9/00055.jpg"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/WC9/00046.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/WC9/00046.jpg"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/WC9/00014.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/WC9/00014.jpg"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/WC9/00021.jpg")
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "whiteCream"))
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/WC9/00021.jpg"))
                ])
            ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            //session.send(msg);
            //var msg1 = new builder.Message(session)
            //        .attachments([
            
            //    new builder.HeroCard(session)
            //                .buttons([
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
            //        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
            //    ])
            //]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }

        
    ]);
    

    //이온 실버 색상
    bot.dialog('/korDesignSelectIonSilver', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/N9V/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/N9V/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/N9V/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/N9V/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/N9V/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/N9V/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                    builder.CardImage.create(session, img_path + "/images/carDesign/N9V/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/N9V/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "IonSilver"))
                ])
            ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

        //    session.beginDialog('/korReMainMenu');
        //    session.endDialog();
            
        //    responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
        //    query.insertHistoryQuery(args, responseTime, function (err, result) {
        //        if (!err) {
        //            console.log("query.getData : " + result);
        //        }
        //    });
        //    //builder.Prompts.choice(session, "그랜저의 다른 색상을 보시겠습니까?", '예|아니오', { listStyle: builder.ListStyle.button });
        //}
            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //루나 그레이 색상
    bot.dialog('/korDesignSelectLunaGray', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/U9G/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/U9G/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/U9G/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/U9G/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/U9G/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/U9G/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/U9G/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/U9G/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "LunaGray"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                    .title("")
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                    ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //판테라 그레이 색상
    bot.dialog('/korDesignSelectPanteraGray', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/PG9/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/PG9/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/PG9/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/PG9/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/PG9/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/PG9/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/PG9/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/PG9/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "PanteraGray"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);


    //미드나잇 블랙 색상
    bot.dialog('/korDesignSelectMidnightBlack', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NB9/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NB9/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NB9/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NB9/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NB9/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NB9/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NB9/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NB9/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "MidnightBlack"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //발렌타인 레드 색상
    bot.dialog('/korDesignSelectValentineRed', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/V9R/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/V9R/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/V9R/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/V9R/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/V9R/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/V9R/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/V9R/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/V9R/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ValentineRed"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //그랑 블루 색상
    bot.dialog('/korDesignSelectGrandBlue', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))
                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NU9/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NU9/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NU9/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NU9/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NU9/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NU9/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/NU9/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/NU9/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "GrandBlue"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //쉐이드 브론즈 차
    bot.dialog('/korDesignSelectShadeBronze', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/S9C/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/S9C/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/S9C/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/S9C/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/S9C/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/S9C/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/S9C/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/S9C/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "ShadeBronze"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }
    ]);

    //카키 메탈 차
    bot.dialog('/korDesignSelectKakiMetal', [
        function (session, args) {
            
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal") + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectedColorMessage"));

            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    //AnimationCard
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailFront"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/TK9/00055.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/TK9/00055.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRight"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/TK9/00046.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/TK9/00046.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailLeft"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/TK9/00014.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/TK9/00014.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal"))
                        ]),
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "colorDetailRear"))

                        .images([
                            builder.CardImage.create(session, img_path + "/images/carDesign/TK9/00021.jpg")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/carDesign/TK9/00021.jpg"))
                                .alt(session.localizer.gettext(query.kor_en_Checker(session.message.text), "KakiMetal"))
                        ])
                ]);
            session.send(msg);
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });

            var msg = new builder.Message(session)
                            .attachments([
            
                new builder.HeroCard(session)
                .title("")
                .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "induceColorDesignToConvenience"))
                .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "convenienceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "Yes")), 
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "YesOrNo"));
            session.endDialog();

        }

    ]);
}

module.exports = {
    create
}