const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const appid = process.env.DocomoAPIAppID
const apiKey = process.env.DocomoAPIKey
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
    };
const bot = new line.Client(line_config);
var request = require('request');

server.listen(process.env.PORT || 3000);

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            console.log(apiKey);
            console.log(appid);
            var options = {
                url: 'https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/dialogue?APIKEY='+apiKey,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                json: {"language": "ja-JP",
                "botId": "Chatting",
                "appId": appid,
                "voiceText": event.message.text
                }
            }
            var msg = "南無";
            request(options, function (error, response, body) {
                msg = body['systemText']['expression'];
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: msg
                }));
            })
        }
    });

});

