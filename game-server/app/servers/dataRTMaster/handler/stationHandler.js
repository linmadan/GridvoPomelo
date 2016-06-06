'use strict';

var Handler = function (app) {
    this.app = app;
};
Handler.prototype.openNewRoom = function (msg, session, next) {
    var AGameHouse = this.app.get('gameHouse');
    var playerData = {};
    playerData.playerID = session.get("playerId");
    playerData.name = session.get('playername');
    var roomData = {};
    roomData.roomName = msg.roomName;
    roomData.gameName = msg.gameName;
    roomData.gamePlayerAmount = msg.gamePlayerAmount;
    AGameHouse.playerOpenNewRoom(playerData, roomData);
    next(null, {code: code.OK});
};

module.exports = function (app) {
    return new Handler(app);
};