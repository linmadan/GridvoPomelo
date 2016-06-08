'use strict';

var Handler = function (app) {
    this.app = app;
};
Handler.prototype.queryConnector = function (msg, session, next) {
    var connectors = this.app.getServersByType('stationConnector');
    if (!connectors || connectors.length === 0) {
        next(null, {code: 500});
        return;
    }
    var index = 0;
    var connector = connectors[index];
    next(null, {
        code: 200,
        host: connector.host,
        port: connector.clientPort
    });
};
module.exports = function (app) {
    return new Handler(app);
};