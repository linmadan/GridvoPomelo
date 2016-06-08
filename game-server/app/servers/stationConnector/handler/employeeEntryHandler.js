'use strict';
var async = require('async');

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
                self.app.rpc.stationEmployeeAccount.accountManageRemote.getAccount(session, accountID, "anonymous", cb);
            }, function (accountData, cb) {
                if (!accountData) {
                    next(null, {code: 500, account: accountData});
                    return;
                }
                account = accountData;
                session.bind(accountID, cb);
            }, function (cb) {
                session.set('dutyStations', account.dutyStations);
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

var onAccountLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }
    return;
};

module.exports = function (app) {
    return new Handler(app);
};
