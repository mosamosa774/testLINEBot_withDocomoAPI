// -----------------------------------------------------------------------------
// const server = require("express")();
// const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
//
// const line_config = {
//
//     channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
//         channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
//         };
//
//         server.listen(process.env.PORT || 3000);
//
//         server.post('/webhook', line.middleware(line_config), (req, res, next) => {
//
//             res.sendStatus(200);
//
//                 console.log(req.body);
//
//                 });
