'use strict';
var mqtt = require('mqtt');

var mqttClient;
var DataReceiveForMQTT = function (app, opts) {
    this.app = app;
    this.mqttBrokerUrl = opts.mqttBrokerUrl;
    this.mqttOptions = opts.mqttOptions;
    this.stationNames = opts.stationNames || [];
};

DataReceiveForMQTT.prototype.start = function (cb) {
    var self = this;
    mqttClient = mqtt.connect(self.mqttBrokerUrl, self.mqttOptions);
    var dataDispatch = this.app.get("dataDispatch");
    mqttClient.on('connect', function () {
        mqttClient.on('message', function (topic, message) {
            if (topic.indexOf("rd/") == 0) {
                var data = {};
                var stationNameEndIndex = topic.indexOf("/", 3);
                data.stationName = topic.slice(3, stationNameEndIndex);
                var dataName2StartIndex = topic.lastIndexOf("/") + 1;
                var dataName2 = topic.slice(dataName2StartIndex);
                var dataName1StartIndex = topic.indexOf("/", stationNameEndIndex + 1) + 1;
                var dataName1 = topic.slice(dataName1StartIndex, dataName2StartIndex - 1);
                data.dataName = `${dataName1}_${dataName2}`;
                var m = JSON.parse(message.toString());
                data.value = m.vl;
                data.timestamp = m.ts;
                dataDispatch.receiveData(data);
            }
        });
        for (let stationName of self.stationNames) {
            mqttClient.subscribe(`rd/${stationName}/#`);
        }
        console.log('data receive for MQTT start');
    });
    process.nextTick(cb);
};

DataReceiveForMQTT.prototype.afterStart = function (cb) {
    process.nextTick(cb);
};

DataReceiveForMQTT.prototype.stop = function (force, cb) {
    mqttClient.end();
    console.log('data receive for MQTT stop');
    process.nextTick(cb);
};

module.exports = function (app, opts) {
    return new DataReceiveForMQTT(app, opts);
};