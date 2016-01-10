importScripts('ajax.js');

self.onmessage = function (event) {
    self.postMessage(getJson('/Services/TickerHandler.ashx?symbol=' + event.data));
};