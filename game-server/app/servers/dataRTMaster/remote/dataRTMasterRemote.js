'use strict';

var Remote = function (app) {
    this.app = app;
};

Remote.prototype.receiveRTData = function (rTData, callback) {
    var dataRTMaster = this.app.get('dataRTMaster');
    rTData.timestamp = new Date(rTData.timestamp);
    dataRTMaster.receiveRTData(rTData);
    var err = null;
    callback(err, {isReceived: true});
};

module.exports = function (app) {
    return new Remote(app);
};