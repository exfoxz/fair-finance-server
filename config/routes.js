/**
 * Created by sam on 01/09/2014.
 */
// Load routes
//var objects = require('../routes/objects');
var fair = require('../routes/fair');

module.exports = function (app) {
    app.get('/sentiment', fair);
}