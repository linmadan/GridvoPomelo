'use strict';
var coDataReceiveForMQTT = require('../components/dataReceiveForMQTT');
var gdc = require('gridvo-dc');
var appEvent = gdc.appEvent;

var configure = function (app) {
    var dataDispatch = gdc.createDataDispatch();
    dataDispatch.on(appEvent.application.DATA_POINT_SAVE_SUCCESS, function (eventData) {
        var routeParam = `dataRTMaster_${app.getServerId().split("_")[1]}`;
        app.rpc.dataRTMaster.dataRTMasterRemote.receiveRTData(routeParam, eventData, function (rpcResult) {
            if (rpcResult.code == 200) {
                console.log(`data rt master had receive data:${JSON.stringify(eventData)}`);
            }
            else {
                console.log("data rt master receive data fail");
            }
        });
    });
    app.loadConfig('dataReceiveForMQTTCfg', require.resolve('../../config/dataReceiveForMQTT.json'));
    app.load(coDataReceiveForMQTT, app.get('dataReceiveForMQTTCfg')[app.getServerId()]);
    app.set('dataDispatch', dataDispatch);
};

module.exports = configure;