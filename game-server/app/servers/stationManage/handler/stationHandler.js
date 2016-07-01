'use strict';
var _ = require('underscore');

var Handler = function (app) {
    this.app = app;
};
Handler.prototype.getStationDVConfig = function (msg, session, next) {
    if (!msg.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations"), msg.stationName) == -1) {
        next(null, {code: 500});
        return;
    }
    var stationManage = this.app.get("stationManage");
    stationManage.getStationDVConfig(msg.stationName, function (err, dVConfigs) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        next(null, {
            code: 200,
            dVConfigs: dVConfigs,
        });
    })
};
Handler.prototype.setStationDVConfig = function (msg, session, next) {
    if (!msg.stationDVConfig.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations"), msg.stationDVConfig.stationName) == -1) {
        next(null, {code: 500});
        return;
    }
    var stationManage = this.app.get("stationManage");
    stationManage.setStationDVConfig(msg.stationDVConfig, function (err, isSuccess) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        next(null, {
            code: 200,
            isSuccess: isSuccess,
        });
    })
};
Handler.prototype.getStationRDConfig = function (msg, session, next) {
    if (!msg.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations"), msg.stationName) == -1) {
        next(null, {code: 500});
        return;
    }
    var stationManage = this.app.get("stationManage");
    stationManage.getStationRDConfig(msg.stationName, function (err, rDConfigs) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        next(null, {
            code: 200,
            rDConfigs: rDConfigs,
        });
    })
};
Handler.prototype.setStationRDConfig = function (msg, session, next) {
    if (!msg.stationRDConfig.stationName) {
        next(null, {code: 500});
        return;
    }
    if (_.indexOf(session.get("dutyStations"), msg.stationRDConfig.stationName) == -1) {
        next(null, {code: 500});
        return;
    }
    var stationManage = this.app.get("stationManage");
    var self = this;
    stationManage.setStationRDConfig(msg.stationRDConfig, function (err, isSuccess) {
        if (err) {
            next(err, {code: 500});
            return;
        }
        if (isSuccess) {
            self.app.rpc.dataRTMaster.dataRTMasterRemote.reLaunchStationRDM(session, msg.stationRDConfig.stationName, function () {
                return;
            });
        }
        next(null, {
            code: 200,
            isSuccess: isSuccess,
        });
    })
};
module.exports = function (app) {
    return new Handler(app);
};