const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const appid = process.env.DocomoAPIAppID
const apiKey = process.env.DocomoAPIKey
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
    };
const bot = new line.Client(line_config);
var request = require('sync-request');

function getJSON(message) {
    var response = request(
        'POST',
        "https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/dialogue?APIKEY="+apiKey,
        "Content-Type: application/json",
        "{\"language\": \"ja-JP\",\"botId\": \"Chatting\",\"appId\": \""+appid+"\",\"voiceText\": \""+message+"\",\"clientData\": {\"option\": {\"nickname\": \"光\",\"nicknameY\": \"ヒカリ\",\"sex\": \"女\",\"bloodtype\": \"B\",\"birthdateY\": \"1997\",\"birthdateM\": \"5\",\"birthdateD\": \"30\",\"age\": \"16\",\"constellations\": \"双子座\",\"place\": \"東京\",\"mode\": \"dialog\"}},\"appRecvTime\": \"2015-05-05 13:30:00\",\"appSendTime\": \"2015-05-05 13:31:00\"}"
    );
    console.log("Status Code (function) : "+response.statusCode);
    return response.json();
}

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
            res_JSON = getJSON(event.message.text);
            console.log(res_JSON);
            if (event.message.text == "こんにちは"){
                // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "これはこれは"
                }));
            }
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});
