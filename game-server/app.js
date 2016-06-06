'use strict';
var pomelo = require('pomelo');
var configureDataDispatch = require('./app/appConfigures/configureDataDispatch');
var configureDataRTMaster = require('./app/appConfigures/configureDataRTMaster');

var app = pomelo.createApp();
app.set('name', 'GridvoPomelo');

app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: false,
            useProtobuf: false
        });
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
