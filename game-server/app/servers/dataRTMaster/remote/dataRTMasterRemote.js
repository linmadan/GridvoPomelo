'use strict';
var _ = require('underscore');

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

Remote.prototype.seChangeStationRDM = function (changeData, callback) {
    if (!_.isNull(changeData.previousStation)) {
        var preChannel = this.app.get('channelService').getChannel(changeData.previousStation, true);
        preChannel.leave(changeData.accountID, changeData.serverID);
    }
    var curChannel = this.app.get('channelService').getChannel(changeData.currentStation, true);
    curChannel.add(changeData.accountID, changeData.serverID);
    var err = null;
    callback(err, {isSuccess: true});
};

Remote.prototype.seCancelStationRDM = function (changeData, callback) {
    if (_.isNull(changeData.currentStation)) {
        return;
    }
    var curChannel = this.app.get('channelService').getChannel(changeData.currentStation, true);
    curChannel.leave(changeData.accountID, changeData.serverID);
    var err = null;
    callback(err, {isSuccess: true});
};

module.exports = function (app) {
    return new Remote(app);
};