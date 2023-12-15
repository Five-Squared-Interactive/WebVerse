const ws = require('ws');
const https = require('https');
const Logging = require('./logging');

module.exports = {
    CreateWebSocketServer: function(port, certinfo, onConnected, onMessage) {
        CreateWebSocketServer(port, certinfo, onConnected, onMessage);
    }
};

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