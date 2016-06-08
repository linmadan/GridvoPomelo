'use strict';
var gdc = require('gridvo-dc');

var configure = function (app) {
    var route = function (routeParam, msg, app, cb) {
        var servers = app.getServersByType('stationManage');
        if (!servers || servers.length === 0) {
            cb(new Error('can not find stationManage servers.'));
            return;
        }
        var serverID = "stationManage";
        cb(null, serverID);
    };
    app.route('stationManage', route);
    var stationManage = gdc.createStationManage();
    app.set('stationManage', stationManage);
};

module.exports = configure;