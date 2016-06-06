'use strict';
var gdc = require('gridvo-dc');
var appEvent = gdc.appEvent;

var configure = function (app) {
    var route = function (routeParam, msg, app, cb) {
        var servers = app.getServersByType('dataRTMaster');
        if (!servers || servers.length === 0) {
            cb(new Error('can not find dataRTMaster servers.'));
            return;
        }
        var serverID = routeParam;
        cb(null, serverID);
    };
    app.route('dataRTMaster', route);
    var dataRTMaster = gdc.createDataRTMaster();
    app.loadConfig('dataRTMasterCfg', require.resolve('../../config/dataRTMaster.json'));
    var stationNames = app.get('dataRTMasterCfg')[app.getServerId()].stationNames;
    dataRTMaster.launch(stationNames, function (err, cBData) {
        if (err) {
            console.log("data rt master launch fail");
            return;
        }
        app.set('dataRTMaster', dataRTMaster);
        console.log(`data rt master launch station count:${cBData.stationCount},RD count:${cBData.rTDataCount}`);
    });
};

module.exports = configure;