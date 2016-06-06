'use strict';

var Remote = function (app) {
    this.app = app;
};

Remote.prototype.receiveRTData = function (rTData, cb) {
    var dataRTMaster = this.app.get('dataRTMaster');
    rTData.timestamp = new Date(rTData.timestamp);
    dataRTMaster.receiveRTData(rTData);
    cb({code: 200});
};

module.exports = function (app) {
    return new Remote(app);
};