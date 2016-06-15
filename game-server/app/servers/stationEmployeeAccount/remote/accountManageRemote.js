'use strict';

var Remote = function (app) {
    this.app = app;
};

Remote.prototype.register = function (accountData, callback) {
    this.app.get("seAccountManage").registerAccount(accountData, function (err, isSuccess) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isSuccess);
    });
};

Remote.prototype.auth = function (authData, callback) {
    this.app.get("seAccountManage").accountAuth(authData, function (err, isPass) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isPass);
    });
};

Remote.prototype.getAccount = function (accountID, callback) {
    this.app.get("seAccountManage").getAccount(accountID, function (err, accountData) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, accountData);
    });
};

module.exports = function (app) {
    return new Remote(app);
};