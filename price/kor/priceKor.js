var builder = require('botbuilder');
var query = require('../../config/query');
var date = require('date-utils');
date = new Date();

var query = require('../../config/query');
var stored = require('../../config/storedModel');
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

function create(bot) {
    /***********************************************************************************
    1. 한국어 가격 초기 메뉴(모델 카드)
    ************************************************************************************/

    var responseTime;
    
    bot.dialog('/korPriceModel', [

        function (session, args) {
            session.userData.model = "";
            session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceWelcomeMessage"));
            var msg = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                /*
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceGasoline2.4ModelMessage"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/price/Grandeur_24spec.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_24spec.PNG"))
                ])
                        .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline2.4"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline2.4ClickMessage"))
                ]) */
                new builder.VideoCard(session)
                        .title('그랜다이저')
                        .autostart(true)
                        .subtitle('Grandizer')
                        .text('test')
                        .media([
                    { url: 'https://youtu.be/VQtonf1fv_s?list=PLNSKpl7JCPswwj_fWkfixq5L7QeZJA4Ot' }
                ])
                        ,
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceGasoline3.0ModelMessage"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/price/Grandeur_30spec.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_30spec.PNG"))
                ])
                        .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.0"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.0ClickMessage"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.3ClickMessage"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/price/Grandeur_33spec.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_33spec.PNG"))
                ])
                        .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.3"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.3ClickMessage"))
                ]),
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceDiesel2.2ModelMessage"))
                        .images([
                    builder.CardImage.create(session, img_path + "/images/price/Grandeur_22spec.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_22spec.PNG"))
                ])
                        .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "diesel2.2"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "diesel2.2ClickMessage"))
                ])
            ]);
            builder.Prompts.choice(session, msg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceModelMenuList"));
            session.endDialog();
            //session.beginDialog('/korReMainMenu');
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
    
    /***********************************************************************************
    2. 한국어 가격 메뉴 (트림 카드)
    ************************************************************************************/

    bot.dialog('/korPriceTrim', [
        function (session, args) {
            var model = args.model;
            var trim = args.trim;
            var trim1 = "";
            var trim2 = "";
            var trim3 = "";
            var trimCard1;
            var trimCard2;
            var trimCard3;
            var trimCard4;
            var msg;
            var showTrim;
            if (args.sendMsg.match(/모던/g) || args.sendMsg.match(/프리미엄/g) || args.sendMsg.match(/프리미엄스페셜/g) || args.sendMsg.match(/프리미엄 스페셜/g) 
                || args.sendMsg.match(/익스클루시브/g) || args.sendMsg.match(/익스클루시브스페셜/g) || args.sendMsg.match(/익스클루시브 스페셜/g) 
                || args.sendMsg.match(/셀러브리티/g)) {
                session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimWelcomeMessgae1"));
            } else {
                session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimWelcomeMessgae2"));
            }
            if (args.sendMsg.match(/가솔린2.4/g) || args.sendMsg.match(/가솔린 2.4/g)) {
                model = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4Model");
                trim1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimModern");
                trim2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimPremium");
                trim3 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimPremiumSpecial");
                //모던 카드
                trimCard1 = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //프리미엄 카드
                trimCard2 = [new builder.HeroCard(session)
                    .title(model + " " + trim2)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //프리미엄 스페셜 카드
                trimCard3 = [new builder.HeroCard(session)
                    .title(model + " " + trim3)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //모던 + 프리미엄 + 프리미엄 스페셜 카드
                trimCard4 = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ModernSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ]),
                    new builder.HeroCard(session)
                        .title(model + " " + trim2)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumPrice"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                        .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ]),
                    new builder.HeroCard(session)
                        .title(model + " " + trim3)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialPrice"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                        .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4PremiumSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                if (args.sendMsg.match(/모던/g)) {
                    showTrim = trimCard1;
                } else if (args.sendMsg.match(/프리미엄스페셜/g) || args.sendMsg.match(/프리미엄 스페셜/g)) {
                    showTrim = trimCard3;
                } else if (args.sendMsg.match(/프리미엄/g)) {
                    showTrim = trimCard2;
                } else {
                    showTrim = trimCard4;
                }
                msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(showTrim);
            } else if (args.sendMsg.match(/가솔린3.0/g) || args.sendMsg.match(/가솔린 3.0/g)) {
                model = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline3.0Model");
                trim1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimExclusive");
                trim2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimExclusiveSpecial");
                //익스클루시브 카드
                trimCard1 = [new builder.HeroCard(session)
                        .title(model + " " + trim1)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusivePrice"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_exclusive.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_exclusive.PNG"))
                    ])
                        .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //익스클루시브 스페셜 카드
                trimCard2 = [new builder.HeroCard(session)
                    .title(model + " " + trim2)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_exclusive.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_exclusive.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //익스클루시브 + 익스클루시브 스페셜 카드
                trimCard3 = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusivePrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_exclusive.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_exclusive.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ]),
                    new builder.HeroCard(session)
                        .title(model + " " + trim2)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialPrice"))
                        .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_exclusive.PNG")
                                .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_exclusive.PNG"))
                    ])
                        .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline2.4ExclusiveSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                if (args.sendMsg.match(/익스클루시브스페셜/g) || args.sendMsg.match(/익스클루시브 스페셜/g)) {
                    showTrim = trimCard2;
                } else if (args.sendMsg.match(/익스클루시브/g)) {
                    showTrim = trimCard1;
                } else {
                    showTrim = trimCard3;
                }
                msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(showTrim);
            } else if (args.sendMsg.match(/가솔린3.3/g) || args.sendMsg.match(/가솔린 3.3/g)) {
                model = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline3.3Model");
                trim1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimCelebrity");
                //셀러브리티 카드
                showTrim = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline3.3CelebrityPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_celebrity.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_celebrity.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline3.3CelebrityBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimGasoline3.3CelebritySelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(showTrim);
            } else if (args.sendMsg.match(/디젤2.2/g) || args.sendMsg.match(/디젤 2.2/g)) {
                model = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2Model");
                trim1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimModern");
                trim2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimPremium");
                trim3 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimPremiumSpecial");
                //모던 카드
                trimCard1 = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //프리미엄 카드
                trimCard2 = [new builder.HeroCard(session)
                    .title(model + " " + trim2)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //프리미엄 스페셜 카드
                trimCard3 = [new builder.HeroCard(session)
                    .title(model + " " + trim3)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                //모던 + 프리미엄 + 프리미엄 스페셜 카드
                trimCard4 = [new builder.HeroCard(session)
                    .title(model + " " + trim1)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2ModernSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ]),
                    new builder.HeroCard(session)
                    .title(model + " " + trim2)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ]),
                    new builder.HeroCard(session)
                    .title(model + " " + trim3)
                    .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialPrice"))
                    .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
                            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialBasicItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimBasicOptionViewMessage")),
                        builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimDiesel2.2PremiumSpecialSelectItemMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceTrimSelectOptionAddMessage"))
                    ])];
                if (args.sendMsg.match(/모던/g)) {
                    showTrim = trimCard1;
                } else if (args.sendMsg.match(/프리미엄스페셜/g) || args.sendMsg.match(/프리미엄 스페셜/g)) {
                    showTrim = trimCard3;
                } else if (args.sendMsg.match(/프리미엄/g)) {
                    showTrim = trimCard2;
                } else {
                    showTrim = trimCard4;
                }
                msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(showTrim);
            }
            builder.Prompts.choice(session, msg, "BTN1|BTN2|BTN3|BTN4|BTN5|BTN6");
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
    3-1. 한국어 가격 메뉴 (기본옵션 보기)
    ************************************************************************************/
    bot.dialog('/korPriceBasicOptionList', [
        function (session, args) {
            
            var modelTrim;
            var powerTrain;
            var performance;
            var safety;
            var outSide;
            var inSide;
            var sit;
            var convenience;
            var multi;
            
            if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModern")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernPowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernPerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernSafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernSit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModernMulti");
                session.send(modelTrim + powerTrain + performance + safety + outSide + inSide + sit + convenience + multi);

            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecial")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialPowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialPerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialSafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialSit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecialMulti");
                session.send(modelTrim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "includeGasoline2.4PremiumBasicOption") + outSide + inSide + sit + convenience);

            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremium")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumPowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumPerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumMulti");
                session.send(modelTrim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "includeGasoline2.4ModernBasicOption") + safety + sit + convenience);

            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecial")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialPowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialPerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialSafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialSit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecialMulti");;
                session.send(modelTrim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "includeGasoline3.0ExclusiveBasicOption") + outSide + inSide + convenience);

            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusive")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusivePowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusivePerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveMulti");
                session.send(modelTrim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "includeGasoline2.4PremiumSpecialBasicOption") + powerTrain + convenience);

            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrity")) {
                modelTrim = "[" + args.model + " " + args.trim + "]\n\n";
                powerTrain = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityPowerTrain");
                performance = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityPerformance");
                safety = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebritySafety");
                outSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityOutside");
                inSide = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityInSide");
                sit = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebritySit");
                convenience = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityConvenience");
                multi = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrityMulti");
                session.send(modelTrim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "includeGasoline3.0ExclusiveSpecialBasicOption") + powerTrain + performance + outSide + inSide + sit + convenience + multi);
            }
            
            var nextBtn = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionEndMessage"))
                        .buttons([
                    builder.CardAction.imBack(session, args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionEndYesClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionEndYesMessage")),
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"))
                ])
            ]);
            //builder.Prompts.choice(session, nextBtn, args.model + " " + args.trim + " 기본품목|홈", { listStyle: builder.ListStyle.button });
            builder.Prompts.choice(session, nextBtn, session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionEndMenuList"), { listStyle: builder.ListStyle.button });
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
    3-2. 한국어 가격 메뉴 (선택옵션 리스트)
    ************************************************************************************/
    bot.dialog('/korPriceSelectOptionList', [
        function (session, args) {
            var model = args.model;
            var trim = args.trim;
            var selectItem1;
            var selectItem2;
            var selectItem3;
            var selectItem4;
            var selectItem5;
            var selectItem6;
            var selectItem7;
            var options;
            
            session.send(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionInitMessage"));
            
            if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionModern")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem10ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem10"))
                    ])];
            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionPremium")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem6ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem6")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem8ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem8"))
                    ])];
            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionPremiumSpecial1") || args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionPremiumSpecial2")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9"))
                    ])];
            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionExclusive")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11"))
                    ])];
            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionExclusiveSpecial1") || args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionExclusiveSpecial2")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem12ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem12"))
                    ])];
            } else if (args.trim == session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionCelebrity")) {
                options = [new builder.HeroCard(session)
                    .title(args.model + " " + args.trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOption"))
                    .buttons([
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5")),
                        builder.CardAction.imBack(session, model + " " + trim + session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9ClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9"))
                    ])];
            }
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(options);
            builder.Prompts.choice(session, msg, "BTN1|BTN|2|BTN3|BTN4|BTN5|BTN6");
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
    3-2-1. 한국어 가격 메뉴 (선택옵션 가격표)
    ************************************************************************************/
    bot.dialog('/korPriceRecipt', [
        function (session, args, next) {
            session.send("선택하신 차량의 산출 가격 입니다.");
            console.log(userId + " user insert : " + session.message.text);

            var fnResult = '';
            var fnResultsplit = '';
            var fnResultModelNm = '';
            var fnResultTrimNm = '';
            var fnResultOptionNm = '';
            fnResult = optionNumChoice(session, session.message.text);
            fnResultsplit = fnResult.split('|');
            fnResultTrimNm = fnResultsplit[3];
            fnResultModelNm = fnResultsplit[2];
            fnResultOptionNm = fnResultsplit[5];
            
            var selectData = new Array();
            selectData[0] = fnResultModelNm + fnResultTrimNm;
            selectData[1] = fnResultOptionNm;
            if (args.check == "add") {
                //추가
                stored.addmodel(selectData);
            } else if (args.check == "del"){
                //삭제
                stored.delmodel(selectData);
            }
            //옵션값
            var searchData = stored.getmodel(fnResultModelNm + fnResultTrimNm);
            //console.log("searchData  ::: " + searchData);
            //console.log("searchData.length :::" + searchData.length);

            var modelNm;
            var modelPrice = 0;
            var optionNm;
            var optionPrice = 0;
            var optionTotal = 0;
            var total = 0;
            for (var i = 0; i < searchData.length; i++) {
                modelNm = searchData[i][0];
                modelPrice = searchData[i][1];
                optionNm = searchData[i][2];
                optionPrice = searchData[i][3];

                optionTotal = optionTotal + searchData[i][3]
            }
            //합계
            total = searchData[0][1] + optionTotal;

            //선택된 옵션만 담기
            var items;

            if (searchData.length == 0) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),];
            } else if (searchData.length == 1) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2])];
            } else if (searchData.length == 2) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2])];
            } else if (searchData.length == 3) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2])];
            } else if (searchData.length == 4) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2])];
            } else if (searchData.length == 5) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[4][2])];
            } else if (searchData.length == 6) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[4][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[5][2])];
            } else if (searchData.length == 7) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[4][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[5][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[6][2])];
            } else if (searchData.length == 8) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[4][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[5][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[6][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[7][2])];
            } else if (searchData.length == 9) {
                items = [builder.ReceiptItem.create(session, number_format(searchData[0][1]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), modelNm),
                    builder.ReceiptItem.create(session, number_format(searchData[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[0][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[1][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[2][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[3][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[4][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[5][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[6][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[7][2]),
                    builder.ReceiptItem.create(session, number_format(searchData[8][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), searchData[8][2])];
            }

            var msg = new builder.Message(session)
                .attachments([
                    new builder.ReceiptCard(session)
                        .title(args.model + " " + args.trim)
                        .items(items)
                        .facts([
                            builder.Fact.create(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu2"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu1"))
                        ])
                        .total(number_format(total) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"))
                ]);
            session.send(msg);

            var nextBtn = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments([
                    new builder.HeroCard(session)
                        .title(session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndMessage"))
                        .buttons([
                            builder.CardAction.imBack(session, args.model + " " + args.trim + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndYesClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndYesMessage")),
                            //builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndNoClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndNoMessage"))
                            builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReMainCall"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionEndNoMessage"))
                        ])
                ]);
            builder.Prompts.choice(session, nextBtn, args.model + " " + args.trim + " " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptEndMenuList"), { listStyle: builder.ListStyle.button });
            session.endDialog();
        }
    ]);
    
    bot.dialog('/korCompareModel', [
        function (session, args) {
            var compare1 = args.sendPrice[0];
            var compare2 = args.sendPrice[1];
            var msg;
            var price1;
            var price2;
            var title1 = null;
            var title2 = null;
            var model1
            var model2
            var total1 = 0;
            var total2 = 0;
            var item1;
            var itme2;
            
            if (compare1 != null) {
                
                compare1 = compare1.replace(/ /gi, "");
                
                switch (compare1) {
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase1"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle1");
                        price1 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase2"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle2");
                        price1 = 31750000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase3"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle3");
                        price1 = 33750000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase4"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle4");
                        price1 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase5"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle5");
                        price1 = 38700000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase6"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle6");
                        price1 = 40200000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase7"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle7");
                        price1 = 41600000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase8"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle8");
                        price1 = 33550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase9"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle9");
                        price1 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase10"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle10");
                        price1 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase11"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle11");
                        price1 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase12"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle12");
                        price1 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase13"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle13");
                        price1 = 41600000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase14"):
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle14");
                        price1 = 33550000;
                        break;
                    default:
                        title1 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle1");
                        price1 = 30550000;
                        break;
                }
                
                model1 = stored.getmodel(title1);
                
                for (var i = 0; i < model1.length; i++) {
                    total1 += parseInt(model1[i][3]);
                }
                
                total1 += parseInt(price1);
                total1 = number_format(total1);
                
                var item1;
                
                if (model1.length == 0) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),];
                } else if (model1.length == 1) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2])];
                } else if (model1.length == 2) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2])];
                } else if (model1.length == 3) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2])];
                } else if (model1.length == 4) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2])];
                } else if (model1.length == 5) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2]),
                        builder.ReceiptItem.create(session, number_format(model1[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[4][2])];
                } else if (model1.length == 6) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2]),
                        builder.ReceiptItem.create(session, number_format(model1[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[4][2]),
                        builder.ReceiptItem.create(session, number_format(model1[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[5][2])];
                } else if (model1.length == 7) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2]),
                        builder.ReceiptItem.create(session, number_format(model1[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[4][2]),
                        builder.ReceiptItem.create(session, number_format(model1[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[5][2]),
                        builder.ReceiptItem.create(session, number_format(model1[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[6][2])];
                } else if (model1.length == 8) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2]),
                        builder.ReceiptItem.create(session, number_format(model1[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[4][2]),
                        builder.ReceiptItem.create(session, number_format(model1[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[5][2]),
                        builder.ReceiptItem.create(session, number_format(model1[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[6][2]),
                        builder.ReceiptItem.create(session, number_format(model1[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[7][2])];
                } else if (model1.length == 9) {
                    item1 = [builder.ReceiptItem.create(session, number_format(price1) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title1),
                        builder.ReceiptItem.create(session, number_format(model1[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[0][2]),
                        builder.ReceiptItem.create(session, number_format(model1[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[1][2]),
                        builder.ReceiptItem.create(session, number_format(model1[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[2][2]),
                        builder.ReceiptItem.create(session, number_format(model1[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[3][2]),
                        builder.ReceiptItem.create(session, number_format(model1[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[4][2]),
                        builder.ReceiptItem.create(session, number_format(model1[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[5][2]),
                        builder.ReceiptItem.create(session, number_format(model1[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[6][2]),
                        builder.ReceiptItem.create(session, number_format(model1[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[7][2]),
                        builder.ReceiptItem.create(session, number_format(model1[8][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model1[8][2])];
                }


            }
            
            if (compare2 != null) {
                
                compare2 = compare2.replace(/ /gi, "");
                
                switch (compare2) {
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase1"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle1");
                        price2 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase2"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle2");
                        price2 = 31750000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase3"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle3");
                        price2 = 33750000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase4"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle4");
                        price2 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase5"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle5");
                        price2 = 38700000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase6"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle6");
                        price2 = 40200000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase7"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle7");
                        price2 = 41600000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase8"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle8");
                        price2 = 33550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase9"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle9");
                        price2 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase10"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle10");
                        price2 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase11"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle11");
                        price2 = 30550000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase12"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle12");
                        price2 = 35500000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase13"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle13");
                        price2 = 41600000;
                        break;
                    case session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareCase14"):
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle14");
                        price2 = 33550000;
                        break;
                    default:
                        title2 = session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareTitle1");
                        price2 = 30550000;
                        break;
                }
                
                model2 = stored.getmodel(title2);
                
                for (var i = 0; i < model2.length; i++) {
                    total += parseInt(model2[i][3]);
                }
                
                total2 += parseInt(price2);
                total2 = number_format(total2);
                
                var item2;
                
                if (model2.length == 0) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),];
                } else if (model2.length == 1) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2])];
                } else if (model2.length == 2) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2])];
                } else if (model2.length == 3) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2])];
                } else if (model2.length == 4) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2])];
                } else if (model2.length == 5) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2]),
                        builder.ReceiptItem.create(session, number_format(model2[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[4][2])];
                } else if (model2.length == 6) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2]),
                        builder.ReceiptItem.create(session, number_format(model2[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[4][2]),
                        builder.ReceiptItem.create(session, number_format(model2[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[5][2])];
                } else if (model2.length == 7) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2]),
                        builder.ReceiptItem.create(session, number_format(model2[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[4][2]),
                        builder.ReceiptItem.create(session, number_format(model2[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[5][2]),
                        builder.ReceiptItem.create(session, number_format(model2[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[6][2])];
                } else if (model2.length == 8) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2]),
                        builder.ReceiptItem.create(session, number_format(model2[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[4][2]),
                        builder.ReceiptItem.create(session, number_format(model2[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[5][2]),
                        builder.ReceiptItem.create(session, number_format(model2[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[6][2]),
                        builder.ReceiptItem.create(session, number_format(model2[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[7][2])];
                } else if (model2.length == 9) {
                    item2 = [builder.ReceiptItem.create(session, number_format(price2) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), title2),
                        builder.ReceiptItem.create(session, number_format(model2[0][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[0][2]),
                        builder.ReceiptItem.create(session, number_format(model2[1][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[1][2]),
                        builder.ReceiptItem.create(session, number_format(model2[2][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[2][2]),
                        builder.ReceiptItem.create(session, number_format(model2[3][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[3][2]),
                        builder.ReceiptItem.create(session, number_format(model2[4][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[4][2]),
                        builder.ReceiptItem.create(session, number_format(model2[5][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[5][2]),
                        builder.ReceiptItem.create(session, number_format(model2[6][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[6][2]),
                        builder.ReceiptItem.create(session, number_format(model2[7][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[7][2]),
                        builder.ReceiptItem.create(session, number_format(model2[8][3]) + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"), model2[8][2])];
                }

            }
            
            if (title1 != null && title2 != null) {
                
                session.send(title1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareAndMessage") + title2 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareMessage"));
                /*
                msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                    new builder.HeroCard(session)
            .title(title1)
            .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "price") + " : " + price1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"))
            .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
            .buttons([
                        builder.CardAction.imBack(session, title1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1BasicOptionClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1BasicOptionView")),
                        builder.CardAction.imBack(session, title1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1SelectOptionClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1SelectOptionAdd"))
                    ]),
                    new builder.HeroCard(session)
            .title(title2)
            .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "price") + " : " + price2 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"))
            .images([
                        builder.CardImage.create(session, img_path + "/images/price/Grandeur_modern.PNG")
            .tap(builder.CardAction.showImage(session, img_path + "/images/price/Grandeur_modern.PNG"))
                    ])
            .buttons([
                        builder.CardAction.imBack(session, title1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1BasicOptionClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1BasicOptionView")),
                        builder.CardAction.imBack(session, title1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1SelectOptionClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "compareModelItem1SelectOptionAdd"))
                    ])
                ]);
                */

                var msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments([
                    new builder.ReceiptCard(session)
                            .title(title1)
                            .items(item1)
                            .facts([
                        builder.Fact.create(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu2"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu1"))
                    ])
                            .total(total1 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit")),
                    new builder.ReceiptCard(session)
                            .title(title2)
                            .items(item2)
                            .facts([
                        builder.Fact.create(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu2"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptTopMenu1"))
                    ])
                            .total(total2 + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceReciptCurrencyUnit"))
                ]);
                
                session.send(msg);
                
            } else {
                
                switch (args.intent) {
                    case "korCompareModel":
                        session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "korCompareModelMessage"));
                        break;
                    case "korCompareBeforeModel":
                        session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "korCompareBeforeModelMessage"));
                        break;
                    case "korCompareBeforeModels":
                        session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "korCompareBeforeModelsMessage"));
                        break;
                    default:
                        session.send(session.localizer.gettext(query.kor_en_Checker(session.message.text), "NocompareModelMessage"));
                }
                
            }
            
            var endMsg = new builder.Message(session)
                .attachments([

                new builder.HeroCard(session)
                        .text(session.localizer.gettext(query.kor_en_Checker(session.message.text), "returnMainMenuMessage"))//"원하시는 메뉴를 \n\n 선택하시거나 질문해주세요!!")
                        .buttons([
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceClickMessage"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceModelCall")),
                    builder.CardAction.imBack(session, session.localizer.gettext(query.kor_en_Checker(session.message.text), "No"), session.localizer.gettext(query.kor_en_Checker(session.message.text), "No")),
                ])
            ]);
            builder.Prompts.choice(session, endMsg, session.localizer.gettext(query.kor_en_Checker(session.message.text), "initMenuList"));
            
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
   3-3-1. 한국어 옵션 추가
   ************************************************************************************/
    
    bot.dialog('/korOptionAdd', [
        function (session, args) {
            var fnResult = '';
            var fnResultsplit = '';
            var fnResultModel = '';
            var fnResultOption = '';
            var fnResultModelNm = '';
            var fnResultTrimNm = '';
            var fnResultCarPrice = 0;
            
            
            fnResult = optionNumChoice(session, session.message.text);
            fnResultsplit = fnResult.split('|');
            fnResultModel = fnResultsplit[0];
            fnResultOption = fnResultsplit[1];
            fnResultModelNm = fnResultsplit[2];
            fnResultTrimNm = fnResultsplit[3];
            fnResultCarPrice = fnResultsplit[4];
            fnResultOptionNm = fnResultsplit[5];
            
            console.log(fnResultsplit[5] + " fnResultsplit : " + fnResultsplit.length);
            
            session.send(fnResultModelNm + " " + fnResultTrimNm + " [ " + fnResultOptionNm + " ] " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceOptionAddMessage"));
            
            //functionOptionUpdate(userId, fnResultModel, fnResultOption, 1);
            
            //console.log(functionOptionUpdate(userId, fnResultModel, fnResultOption, 1));
            
            if (!functionOptionUpdate(userId, fnResultModel, fnResultOption, 1)) {
                
                
                setTimeout(function () {
                    session.endDialog();
                    session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: fnResultModelNm, trim: fnResultTrimNm, carPrice: fnResultCarPrice, modelNum: fnResultModel, check: "add" });
                    
                    responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
                    query.insertHistoryQuery(args, responseTime, function (err, result) {
                        if (!err) {
                            console.log("query.getData : " + result);
                        }
                    });
                }, 500); 
            }

            //session.endDialog();
            //session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: fnResultModelNm, trim: fnResultTrimNm , carPrice: fnResultCarPrice});
            
            //responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            //query.insertHistoryQuery(args, responseTime, function (err, result) {
            //    if (!err) {
            //        console.log("query.getData : " + result);
            //    }
            //});
        }
    ]);
    /***********************************************************************************
   3-3-2. 한국어 옵션 삭제
   ************************************************************************************/
    bot.dialog('/korOptionRemove', [
        function (session, args) {
            var fnResult = '';
            var fnResultsplit = '';
            var fnResultModel = '';
            var fnResultOption = '';
            var fnResultModelNm = '';
            var fnResultTrimNm = '';
            var fnResultCarPrice = 0;
            //session.send("옵션을 뺍니다.");
            
            fnResult = optionNumChoice(session, session.message.text);
            fnResultsplit = fnResult.split('|');
            fnResultModel = fnResultsplit[0];
            fnResultOption = fnResultsplit[1];
            fnResultModelNm = fnResultsplit[2];
            fnResultTrimNm = fnResultsplit[3];
            fnResultCarPrice = fnResultsplit[4];
            fnResultOptionNm = fnResultsplit[5];
            
            session.send(fnResultModelNm + " " + fnResultTrimNm + " [ " + fnResultOptionNm + " ] " + session.localizer.gettext(query.kor_en_Checker(session.message.text), "priceOptionRemoveMessage"));
            
            functionOptionUpdate(userId, fnResultModel, fnResultOption, 0);
            
            
            session.endDialog();
            session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korPriceRecipt", tableNm: "insert_history", model: fnResultModelNm, trim: fnResultTrimNm, carPrice: fnResultCarPrice, modelNum: fnResultModel, check: "del" });
            
            responseTime = parseInt(date.getTime()) - parseInt(args.beginTime);
            query.insertHistoryQuery(args, responseTime, function (err, result) {
                if (!err) {
                    console.log("query.getData : " + result);
                }
            });
        }
    ]);
    /***********************************************************************************
    3-3-3 . 한국어 옵션 NUMBER 확인
    ************************************************************************************/
    function optionNumChoice(session, message) {
        
        var modelNameVar = "";
        var modelNumberVar = 0;
        var engineNameVar = "";
        var carPriceVar = 0;
        var optionNm = "";
        var modelOptionNumberVar = "";
        
        if (message.match(/가솔린 2.4/g) || message.match(/가솔린2.4/g) || message.match(/2.4/g)) {
            
            engineNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline2.4");
            if (message.match(/모던/g) || message.match(/모 던/g)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModern");
                modelNumberVar = 1;
                carPriceVar = 30550000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/앞좌석통풍/) || message.match(/앞좌석 통풍/) || message.match(/앞 좌석 통풍/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3");
                } else if (message.match(/하이패스 시스템/) || message.match(/하이패스시스템/) || message.match(/하이 패스 시스템/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3");
                } else if (message.match(/현대스마트센스패키지IV/) || message.match(/현대 스마트센스패키지IV/) || message.match(/현대 스마트 센스패키지IV/) || message.match(/현대 스마트 센스 패키지IV/) || message.match(/현대 스마트 센스 패키지 IV/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem10");
                } else {
                    modelOptionNumberVar = 0;
                }
            } else if (message.match(/프리미엄 스페셜/g) || message.match(/프리미엄스페셜/g)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecial");
                modelNumberVar = 3;
                carPriceVar = 33750000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지II/) || message.match(/현대 스마트센스패키지II/) || message.match(/현대 스마트 센스패키지II/) || message.match(/현대 스마트 센스 패키지II/) || message.match(/현대 스마트 센스 패키지 II/)) {
                    modelOptionNumberVar = 6;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9");
                } else if (message.match(/익스테리어패키지II/) || message.match(/익스테리어 패키지II/) || message.match(/익스테리어 패키지 II/) || message.match(/익스테리어패키지 II/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7");
                } else if (message.match(/JBL사운드패키지/) || message.match(/JBL 사운드패키지/) || message.match(/JBL 사운드 패키지/)) {
                    modelOptionNumberVar = 7;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4");
                } else if (message.match(/어라운드뷰모니터(AVM)/) || message.match(/어라운드 뷰모니터(AVM)/) || message.match(/어라운드 뷰 모니터(AVM)/) || message.match(/어라운드 뷰 모니터 (AVM)/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else if (message.match(/스마트전동식트렁크/) || message.match(/스마트 전동식트렁크/) || message.match(/스마트 전동식 트렁크/) || message.match(/스마트전동식 트렁크/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else {
                    modelOptionNumberVar = 0;
                }
            } else if (message.match(/프리미엄/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremium");
                modelNumberVar = 2;
                carPriceVar = 31750000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지I/) || message.match(/현대 스마트센스패키지I/) || message.match(/현대 스마트 센스패키지I/) || message.match(/현대 스마트 센스 패키지I/) || message.match(/현대 스마트 센스 패키지 I/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem8");
                } else if (message.match(/익스테리어패키지I/) || message.match(/익스테리어 패키지I/) || message.match(/익스테리어 패키지 I/) || message.match(/익스테리어패키지 I/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem6");
                } else {
                    modelOptionNumberVar = 0;
                }
            }
        } else if (message.match(/가솔린 3.0/) || message.match(/가솔린3.0/)) {
            
            engineNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.0");
            
            if (message.match(/익스클루시브 스페셜/) || message.match(/익스클루시브스페셜/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusiveSpecial");
                modelNumberVar = 5;
                carPriceVar = 38700000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지II/) || message.match(/현대 스마트센스패키지II/) || message.match(/현대 스마트 센스패키지II/) || message.match(/현대 스마트 센스 패키지II/) || message.match(/현대 스마트 센스 패키지 II/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9");
                } else if (message.match(/JBL사운드패키지/) || message.match(/JBL 사운드패키지/) || message.match(/JBL 사운드 패키지/)) {
                    modelOptionNumberVar = 6;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4");
                } else if (message.match(/프리미어인테리어셀렉션/) || message.match(/프리미어 인테리어셀렉션/) || message.match(/프리미어 인테리어 셀렉션/)) {
                    //session.beginDialog('/korPriceRecipt', { sendMsg: session.message.text, key: userId, beginTime: date.getTime(), intent: "korDesignInteriorDetail", tableNm: "insert_history", model: "가솔린 3.0", trim: "익스클루시브 스페셜", carPrice: 38700000, selectOption1: "프리미어 인테리어 셀렉션", optionPrice1: 1500000 });
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem12");
                } else {
                    modelOptionNumberVar = 0;
                }
            } else if (message.match(/익스클루시브/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionExclusive");
                modelNumberVar = 4;
                carPriceVar = 35500000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지II/) || message.match(/현대 스마트센스패키지II/) || message.match(/현대 스마트 센스패키지II/) || message.match(/현대 스마트 센스 패키지II/) || message.match(/현대 스마트 센스 패키지 II/)) {
                    modelOptionNumberVar = 6;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), " selectOptionItem9 ");
                } else if (message.match(/익스테리어패키지II/) || message.match(/익스테리어 패키지II/) || message.match(/익스테리어 패키지 II/) || message.match(/익스테리어패키지 II/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7");
                } else if (message.match(/어라운드뷰모니터(AVM)/) || message.match(/어라운드 뷰모니터(AVM)/) || message.match(/어라운드 뷰 모니터(AVM)/) || message.match(/어라운드 뷰 모니터 (AVM)/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else if (message.match(/스마트전동식트렁크/) || message.match(/스마트 전동식트렁크/) || message.match(/스마트 전동식 트렁크/) || message.match(/스마트전동식 트렁크/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else {
                    modelOptionNumberVar = 0;
                }
            }

        } else if (message.match(/가솔린 3.3/) || message.match(/가솔린3.3/)) {
            
            engineNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "gasoline3.3");
            
            if (message.match(/셀러브리티/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionCelebrity");
                modelNumberVar = 7;
                carPriceVar = 41600000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지II/) || message.match(/현대 스마트센스패키지II/) || message.match(/현대 스마트 센스패키지II/) || message.match(/현대 스마트 센스 패키지II/) || message.match(/현대 스마트 센스 패키지 II/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9");
                } else {
                    modelOptionNumberVar = 0;
                }
            }
        } else if (message.match(/디젤 2.2/) || message.match(/디젤2.2/)) {
            
            engineNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "diesel2.2");
            
            if (message.match(/모던/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionModern");
                modelNumberVar = 8;
                carPriceVar = 33550000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/앞좌석통풍/) || message.match(/앞좌석 통풍/) || message.match(/앞 좌석 통풍/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3");
                } else if (message.match(/하이패스 시스템/) || message.match(/하이패스시스템/) || message.match(/하이 패스 시스템/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem3");
                } else if (message.match(/현대스마트센스패키지IV/) || message.match(/현대 스마트센스패키지IV/) || message.match(/현대 스마트 센스패키지IV/) || message.match(/현대 스마트 센스 패키지IV/) || message.match(/현대 스마트 센스 패키지 IV/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem10");
                } else {
                    modelOptionNumberVar = 0;
                }
            } else if (message.match(/프리미엄 스페셜/g) || message.match(/프리미엄스페셜/g)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremiumSpecial");
                modelNumberVar = 10;
                carPriceVar = 36750000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지II/) || message.match(/현대 스마트센스패키지II/) || message.match(/현대 스마트 센스패키지II/) || message.match(/현대 스마트 센스 패키지II/) || message.match(/현대 스마트 센스 패키지 II/)) {
                    modelOptionNumberVar = 6;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem9");
                } else if (message.match(/익스테리어패키지II/) || message.match(/익스테리어 패키지II/) || message.match(/익스테리어 패키지 II/) || message.match(/익스테리어패키지 II/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem7");
                } else if (message.match(/JBL사운드패키지/) || message.match(/JBL 사운드패키지/) || message.match(/JBL 사운드 패키지/)) {
                    modelOptionNumberVar = 7;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem4");
                } else if (message.match(/어라운드뷰모니터(AVM)/) || message.match(/어라운드 뷰모니터(AVM)/) || message.match(/어라운드 뷰 모니터(AVM)/) || message.match(/어라운드 뷰 모니터 (AVM)/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else if (message.match(/스마트전동식트렁크/) || message.match(/스마트 전동식트렁크/) || message.match(/스마트 전동식 트렁크/) || message.match(/스마트전동식 트렁크/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem11");
                } else {
                    modelOptionNumberVar = 0;
                }
            } else if (message.match(/프리미엄/)) {
                
                modelNameVar = session.localizer.gettext(query.kor_en_Checker(session.message.text), "basicOptionPremium");
                modelNumberVar = 9;
                carPriceVar = 34750000;
                
                if (message.match(/파노라마 썬루프/) || message.match(/파노라마썬루프/)) {
                    modelOptionNumberVar = 3;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem1");
                } else if (message.match(/TUIX 컴포트 패키지/) || message.match(/TUIX 컴포트패키지/) || message.match(/TUIX컴포트패키지/) || message.match(/튜익스 컴포트 패키지/) || message.match(/튜익스 컴포트패키지/) || message.match(/튜익스컴포트패키지/)) {
                    modelOptionNumberVar = 2;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem2");
                } else if (message.match(/헤드업디스플레이(HUD)/) || message.match(/헤드업 디스플레이(HUD)/) || message.match(/헤드업 디스플레이 (HUD)/) || message.match(/헤드업디스플레이/) || message.match(/헤드업 디스플레이/) || message.match(/HUD/)) {
                    modelOptionNumberVar = 4;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem5");
                } else if (message.match(/현대스마트센스패키지I/) || message.match(/현대 스마트센스패키지I/) || message.match(/현대 스마트 센스패키지I/) || message.match(/현대 스마트 센스 패키지I/) || message.match(/현대 스마트 센스 패키지 I/)) {
                    modelOptionNumberVar = 5;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem8");
                } else if (message.match(/익스테리어패키지I/) || message.match(/익스테리어 패키지I/) || message.match(/익스테리어 패키지 I/) || message.match(/익스테리어패키지 I/)) {
                    modelOptionNumberVar = 1;
                    optionNm = session.localizer.gettext(query.kor_en_Checker(session.message.text), "selectOptionItem6");
                } else {
                    modelOptionNumberVar = 0;
                }
            }

        }
        
        console.log("OPTION : " + modelNumberVar + '|' + modelOptionNumberVar + "|" + engineNameVar + "|" + modelNameVar + "|" + carPriceVar + "|" + optionNm);
        
        return modelNumberVar + '|' + modelOptionNumberVar + "|" + engineNameVar + "|" + modelNameVar + "|" + carPriceVar + "|" + optionNm;

    }
    /***********************************************************************************
    3-3-4 . 옵션 업데이트
    ************************************************************************************/
    function functionOptionUpdate(userID, modelNum, optionNum, val) {
        var statusTask = [
            function (callback) {
                tp.setConnectionConfig(config);
                tp.sql("SELECT USER_ID, MODEL_NUMBER FROM TBL_MODEL_CUSTOMER_SELECTED WHERE USER_ID=@userID")
                    .parameter('userID', TYPES.NVarChar, userID)
                    .execute()
                    .then(function (results) {
                    console.log("TBL_MODEL_CUSTOMER_SELECTED USER_CHECK Success!!!!");
                    callback(null, results);
                }).fail(function (err) {
                    console.log(err);
                });
            },
            function (data, callback) {
                var tf = true;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].MODEL_NUMBER == modelNum) {
                        tf = false;
                        break;
                    }
                }
                
                //console.log("========================== " + tf);
                //console.log("========================== " + data.length);
                if (tf || data.length == 0) {
                    var tableName = "OPTION" + optionNum;
                    tp.setConnectionConfig(config);
                    tp.sql("INSERT INTO TBL_MODEL_CUSTOMER_SELECTED (USER_ID, MODEL_NUMBER, " + tableName + ") " 
                        + "VALUES (@USERID, @MODELNUM, @VAL )  "
                    )
                        .parameter('USERID', TYPES.NVarChar, userID)
                        .parameter('MODELNUM', TYPES.Int, modelNum)
                        .parameter('VAL', TYPES.NVarChar, val)
                        .execute()
                        .then(function (results) {
                        console.log("select TBL_MODEL_CUSTOMER_SELECTED insert success!!!!");
                        callback(null, results);
                    }).fail(function (err) {
                        console.log(err);
                    });
                } else if (!tf && data.length > 0) {
                    var tableName = "OPTION" + optionNum;
                    tp.setConnectionConfig(config);
                    tp.sql("UPDATE TBL_MODEL_CUSTOMER_SELECTED SET " + tableName + " = @val WHERE USER_ID = @userID AND MODEL_NUMBER = @modelNum")
                        .parameter('userID', TYPES.NVarChar, userID)
                        .parameter('modelNum', TYPES.NVarChar, modelNum)
                        .parameter('val', TYPES.NVarChar, val)
                        .execute()
                        .then(function (results) {
                        console.log("TBL_MODEL_CUSTOMER_SELECTED UPDATE Success!!!!");
                        callback(null, results);
                    }).fail(function (err) {
                        console.log(err);
                    });
                } else { 
                    callback(null, "");
                }
                
            }
        ];
        async.waterfall(statusTask, function (err, results) {
            
            var statusMerge;
            
            console.log("UPDATE Result : " + results[0]);
        });
    }


}

// 자동으로 콤마 넣기 
function number_format(num) {
    var num_str = num.toString();
    var result = '';
    
    for (var i = 0; i < num_str.length; i++) {
        var tmp = num_str.length - (i + 1);
        if (i % 3 == 0 && i != 0) result = ',' + result;
        result = num_str.charAt(tmp) + result;
    }
    
    return result;
}


module.exports = {
    create,number_format
}
