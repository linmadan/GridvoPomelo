'use strict';
var pomelo = require('pomelo');
var configureStationEmployeeAccount = require('./app/appConfigures/configureStationEmployeeAccount');
var configureDataDispatch = require('./app/appConfigures/configureDataDispatch');
var configureDataRTMaster = require('./app/appConfigures/configureDataRTMaster');
var configureStationManage = require('./app/appConfigures/configureStationManage');

var app = pomelo.createApp();
app.set('name', 'GridvoPomelo');
app.configure('production|development', 'stationConGate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: false,
            useProtobuf: false
        });
});
app.configure('production|development', 'stationConnector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: false,
            useProtobuf: false
        });
});
app.configure('production|development', 'stationEmployeeAccount', function () {
    configureStationEmployeeAccount(app);
});
app.configure('production|development', 'stationManage', function () {
    configureStationManage(app);
});
app.configure('production|development', 'dataDispatch', function () {
    configureDataDispatch(app);
});
app.configure('production|development', 'dataRTMaster', function () {
    configureDataRTMaster(app);
});
app.start();
process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
