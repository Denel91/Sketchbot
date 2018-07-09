const telegramBot = require('node-telegram-bot-api'); // Referenziamo il pacchetto delle API per i bot telegram.
const Sentiment = require('sentiment'); // Referenziamo il pacchetto per l'analisi del sentiment.
const token = '619859915:AAGhpUxCDZImPQxP07tdSA2MJpioYSOZRc4';
const api = new telegramBot(token, {polling: true});

api.onText(/\/help/, function (msg, match) {
    var fromId = msg.from.id;
    api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me.");
});

api.onText(/\/start/, function (msg, match) {
    var fromId = msg.from.id;
    api.sendMessage(fromId, "They call me Sketchbot. " +
       "I can help you in getting the sentiments of any text you send to me. " +
       "To help you i just have few commands.\n/help\n/start\n/sentiments");
});

var opts = {
    reply_markup: JSON.stringify(
        {
            force_reply: true
        }
    )};

//Sentiment Analysis
api.onText(/\/sentiments/, function(msg, match) {
    var fromId = msg.from.id;
    api.sendMessage(fromId, "Alright! So you need sentiments of a text from me. " +
        "I can help you in that. Just send me the text.", opts)
        .then(function (sended) {
            var chatId = sended.chat.id;
            var messageId = sended.message_id;
            api.onReplyToMessage(chatId, messageId, function (message) {
                var sentiment = new Sentiment();
                // Analizziamo il testo per ottenere i sentiment...
                var result = sentiment.analyze(message.text);
                api.sendMessage(fromId,"So sentiments for your text are:\nScore: " + result.score +
                    "\nComparative: " + result.comparative);
            });
        });
});

console.log("Sketchbot has started. Start conversation in your Telegram.");
