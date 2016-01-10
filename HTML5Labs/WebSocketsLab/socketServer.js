var socketServer = function () {
    var data = null,
    timerID = null,
    sockets = [],
    socketServer = null,
    ws = require('websocket.io'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    domain = require('domain'),
    reqDomain = domain.create(),
    socketDomain = domain.create(),
    httpDomain = domain.create(),

    httpListen = function (port) {
        httpDomain.on('error', function (err) {
            console.log('Error caught in http domain:' + err);
        });

        httpDomain.run(function () {
            http.createServer(function (req, res) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname);
                if (pathname == '/' || pathname == '/index.html') {
                    readFile(res, 'index.html');
                }
                else {
                    readFile(res, '.' + pathname);
                }
            }).listen(port);
        });
    },


    readFile = function(res, pathname) {
        fs.readFile(pathname, function (err, data) {
            if (err) {
                console.log(err.message);
                res.writeHead(404, {'content-type': 'text/html'});
                res.write('File not found: ' + pathname);
                res.end();
            }
            else {
              res.write(data);
              res.end();
            }
        });       
    },




    getPixData = function() {
        var options = {
            host: 'api.flickr.com',
            port: 80,
            path: '/services/feeds/photos_public.gne?format=json&tags=puppies&jsoncallback=?',
            method: 'GET'
        };

        /*var options = {
            host: 'localhost',
            port: 8080,
            path: '/flickr.json',
            method: 'GET'
        };*/

        reqDomain.on('error', function(err) {
            console.log('Error caught in request domain:' + err);
        });

        reqDomain.run(function() { 
            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                var json = '';

                res.on('data', function (chunk) {
                    json += chunk;
                });

                res.on('end', function(){
                    processJson(json);
                });
            });

            req.on('error', function(err) {
                console.log('Problem with request: ' + err);  
            });

            req.end();
        });
    },

    sendPicture = function() {
        console.log('Sending data...');
        var randomPicIndex = Math.floor(Math.random()*data.items.length);



    },

    processJson = function(json) {
        json = json.substring(1, json.length - 1);
        json = json.replace(/\\\'/g,'');
        console.log(json);
        data = JSON.parse(json);
        //Send initial picture down
        sendPicture();
        timerID = setInterval(sendPicture, 5000);
    },

    init = function(httpPort, socketPort) {
        httpListen(httpPort);
        socketListen(socketPort);
    };

    return {
        init: init
    };
}();

/* Add module exports here */
module.exports = socketServer;


