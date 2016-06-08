'use strict';
var account = require('gridvo-seaccount');

var configure = function (app) {
    var route = function (routeParam, msg, app, cb) {
        var servers = app.getServersByType('stationEmployeeAccount');
        if (!servers || servers.length === 0) {
            cb(new Error('can not find stationEmployeeAccount servers.'));
            return;
        }
        var serverID = "stationEmployeeAccount";
        cb(null, serverID);
    };
    app.route('stationEmployeeAccount', route);
    var accountManage = account.createAccountManage();
    app.set('seAccountManage', accountManage);
};

module.exports = configure;