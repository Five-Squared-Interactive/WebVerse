// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

/**
 * @class NodeDaemonConnection
 * @description Class for managing a connection to the WebVerse daemon.
 */
module.exports = function(port, msgHandler) {
    this.isConnected = false;
    this.msgHandler = msgHandler;
    
    this.ws = new WebSocket("wss://localhost:" + port);
    this.isConnected = true;

    /**
     * @method OnOpen Called when the connection is opened.
     */
    this.ws.onopen = function() {
        
    };

    /**
     * @method OnMessage Called when a message is received.
     * @param evt Event.
     */
    this.ws.onmessage = function (evt) {
        var received_msg = evt.data;
        msgHandler(received_msg);
    };

    /**
     * @method OnClose Called when connection is closed.
     */
    this.ws.onclose = function() {
        this.isConnected = false;
        console.log("[WebSocket->OnClose] Connection is closed..."); 
    };
};