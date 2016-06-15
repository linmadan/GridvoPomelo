'use strict';
var async = require('async');
var _ = require('underscore');

var Handler = function (app) {
    this.app = app;
};
Handler.prototype.entry = function (msg, session, next) {
    var self = this;
    if (!msg.accountID || !msg.accountType) {
        next(null, {code: 500});
        return;
    }
    var accountID = msg.accountID;
    var account;
    switch (msg.accountType) {
        case "WeChat" :
            async.waterfall([function (cb) {
                var authData = {};
                authData.accountID = msg.accountID;
                authData.accountType = msg.accountType;
                self.app.rpc.stationEmployeeAccount.accountManageRemote.auth(session, authData, cb);
            }, function (isPass, cb) {
                if (!isPass) {
                    next(null, {code: 500});
                    return;
                }
                self.app.rpc.stationEmployeeAccount.accountManageRemote.getAccount(session, accountID, cb);
            }, function (accountData, cb) {
                if (!accountData) {
                    next(null, {code: 500, account: accountData});
                    return;
                }
                account = accountData;
                session.bind(accountID, cb);
            }, function (cb) {
                session.set('dutyStations', account.dutyStations);
                session.set('previousStation', null);
                session.set('currentStation', null);
                session.on('closed', onAccountLeave.bind(null, self.app));
                session.pushAll(cb);
            }], function (err) {
                if (err) {
                    next(err, {code: 500});
                    return;
                }
                next(null, {
                    code: 200,
                    account: account
                });
            });
            break;
        default:
            next(null, {code: 500});
    }
};

Handler.prototype.selectStation = function (msg, session, next) {
    var self = this;
    if (!msg.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations"), msg.stationName) == -1) {
        next(null, {code: 500});
        return;
    }
    async.waterfall([function (cb) {
        if (!_.isNull(session.get('currentStation'))) {
            session.set('previousStation', session.get('currentStation'));
        }
        session.set('currentStation', msg.stationName);
        session.pushAll(cb);
    }, function (cb) {
        self.app.rpc.dataRTMaster.dataRTMasterRemote.seChangeStationRDM(session, {
            serverID: self.app.getServerId(),
            accountID: session.uid,
            previousStation: session.get('previousStation'),
            currentStation: session.get('currentStation')
        }, cb);
    }], function (err) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        next(null, {code: 200});
    });
};

var onAccountLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }
    self.app.rpc.dataRTMaster.dataRTMasterRemote.seCancelStationRDM(session, {
        serverID: app.getServerId(),
        accountID: session.uid,
        currentStation: session.get('currentStation')
    }, function () {
        return;
    });
};

module.exports = function (app) {
    return new Handler(app);
};
