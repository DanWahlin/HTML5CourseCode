var symbol = 'MSFT', quoteWorker, tickersWorker;

window.onload = function () {
    quoteWorker = new Worker('Scripts/quoteWorker.js');

    quoteWorker.onmessage = function (event) {
        var data = event.data;
        document.getElementById('symbol').innerHTML = data.Company;
        document.getElementById('value').innerHTML = data.Last;
        var date = new Date();
        var minutes = date.getMinutes();
        minutes = (minutes < 10) ? '0' + minutes.toString() : minutes;
        var seconds = date.getSeconds();
        seconds = (seconds < 10) ? '0' + seconds.toString() : seconds;
        document.getElementById('updateTime').innerHTML = date.getHours() + ':' + minutes + ':' + seconds;
    };

    quoteWorker.onerror = function (e) {
        alert('Error: ' + e.filename + ' ' + e.lineno + ' ' + e.message);
    }

    quoteWorker.postMessage(symbol);

    tickersWorker = new Worker('Scripts/tickersWorker.js');

    tickersWorker.onmessage = function (event) {
        var tickers = event.data;
        var results = document.getElementById('results');

        while (results.hasChildNodes()) {
            results.removeChild(results.firstChild);
        }

        for (var i = 0; i < tickers.length; i += 1) {
            // add a list item with a button for each result
            var li = document.createElement('li');
            var tickerDiv = document.createElement('div');
            tickerDiv.className = 'ticker';
            tickerDiv.innerHTML = tickers[i].Symbol;
            tickerDiv.onclick = function () { select(this.innerHTML); };
            li.appendChild(tickerDiv);
            results.appendChild(li);
        }
    };

    search('');
};

function search(query) {
    tickersWorker.postMessage(query);
}

function select(newSymbol) {
    symbol = newSymbol;
    quoteWorker.postMessage(symbol);
}
