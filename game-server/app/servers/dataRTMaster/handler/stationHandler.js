'use strict';
var _ = require('underscore');

var Handler = function (app) {
    this.app = app;
};
Handler.prototype.startRTDataMonitor = function (msg, session, next) {
    if (!msg.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations", msg.stationName)) == -1) {
        next(null, {code: 500});
        return;
    }
    var dataRTMaster = this.app.get("dataRTMaster");
    dataRTMaster.stationStartRTDataMonitor(msg.stationName, function (err, cBData) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        next(null, {
            code: 200,
            stationName: cBData.stationName,
            startSuccess: cBData.startSuccess,
            rTdatas: cBData.rTdatas
        });
    })
};

module.exports = function (app) {
    return new Handler(app);
};