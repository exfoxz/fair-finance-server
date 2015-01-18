// usage: node historicalDataRequest.js <host>
var https = require('https');
var fs = require('fs');

var host = '54.174.49.59';
var port = 443;
var index = 0;

module.exports = function getData(req, resX){
    var tickers = req.query.stock.split("__");
    var options = {
        host: host,
        port: port,
        path: '/request/blp/refdata/ReferenceData',
        method: 'POST',
        key: fs.readFileSync('client.key'),
        cert: fs.readFileSync('client.crt'),
        ca: fs.readFileSync('bloomberg.crt')
    };

    var tTickers = [];
    tickers.forEach(function(t){
        var temp = t + " UN Equity";
        tTickers.push(temp);
    })



    var req = https.request(options, function(res) {
        var result = "";
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            console.log("===========================");
            result+= d;
        });

        res.on('end', function () {
            console.log(result);
            //console.log(result);
            //console.log("Done get data for", tTickers);
            var object = JSON.parse(result);
            //for(var key in object)
            //    console.log(key);
            //console.log(object['data'][0]['securityData']['fieldData']);
            var currentArray = object['data'][0]['securityData'];
            var num = currentArray.length * 2;
            console.log(num);
            var sum = 0;
            currentArray.forEach(function(s){
                console.log("N", s['fieldData']['NEWS_SENTIMENT']);
                console.log("T", s['fieldData']['TWITTER_SENTIMENT']);
                sum+=s['fieldData']['NEWS_SENTIMENT'];
                sum+=s['fieldData']['TWITTER_SENTIMENT'];
            });

            sum = sum / num;

            console.log(sum);
            resX.status(200).send({result: sum}).end();
        })
    });
    req.write(JSON.stringify( {
        "securities": tTickers,
        "fields": ["NEWS_SENTIMENT", "TWITTER_SENTIMENT"]
    }));

    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}