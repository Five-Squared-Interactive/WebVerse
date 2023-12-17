// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const ws = require('ws');
const https = require('https');
const Logging = require('./logging');

/**
 * @module WebSocketServer A WebSocket Server.
 */
module.exports = {
    /**
     * @function CreateWebSocketServer Create a WebSocket Server.
     * @param {*} port Port.
     * @param {*} certinfo Certificate Information.
     * @param {*} onConnected Event to invoke upon connection.
     * @param {*} onMessage Event to invoke upon message.
     */
    CreateWebSocketServer: function(port, certinfo, onConnected, onMessage) {
        CreateWebSocketServer(port, certinfo, onConnected, onMessage);
    }
};

/**
 * @function CreateWebSocketServer Create a WebSocket Server.
 * @param {*} port Port.
 * @param {*} certinfo Certificate Information.
 * @param {*} onConnected Event to invoke upon connection.
 * @param {*} onMessage Event to invoke upon message.
 */
function CreateWebSocketServer(port, certinfo, onConnected, onMessage) {
    const server = https.createServer({
        key: certinfo.privateKey,
        cert: certinfo.certificate
    });
    const wss = new ws.WebSocketServer({ server });

    wss.on('connection', function connection(wsi) {
        wsi.on('message', function incoming(message) {
            onMessage(message);
        });
        onConnected(wsi);
    });

    Logging.Log("[WebSocketServer->CreateWebSocketServer] Listening on port " + port);
    server.listen(port);
}