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

Remote.prototype.reLaunchStationRDM = function (stationName, callback) {
    var dataRTMaster = this.app.get('dataRTMaster');
    dataRTMaster.launchStationRDM(stationName, function (err, cBData) {
        if (err) {
            console.log("站点实时监控重启失败");
            callback(err, {isLaunched: false});
            return;
        }
        callback(null, {isLaunched: cBData.isLaunched});
        console.log(`${cBData.stationName}站点实时监控重启成功`);
    });
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