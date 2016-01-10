importScripts('ajax.js');
var timerID, symbol;

function update() {
    self.postMessage(getJson('/Services/QuoteHandler.ashx?symbol=' + symbol));
    timerID = setTimeout(update, 10000);
}


self.onmessage = function (event) {
    if (timerID) clearTimeout(timerID);
    symbol = event.data;
    update();
};

//Alternate way to handle the message event:
//self.addEventListener('message', function (event) {
//    if (timerID) clearTimeout(timerID);
//    symbol = event.data;
//    update();
//},false);
