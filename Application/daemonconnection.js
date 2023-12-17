// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

/**
 * @class DaemonConnection
 * @description Class for managing a connection to the WebVerse daemon.
 */
class DaemonConnection {
    /**
     * @constructor Constructor for the Daemon Connection.
     * @param {*} port Port to the daemon.
     * @param {*} msgHandler Handler for incoming messages.
     * @param {*} timeout Connection timeout.
     * @param {*} retries Number of connection retries.
     */
    constructor(port, msgHandler, timeout, retries) {
        /**
         * @method Connect Connect to the daemon.
         * @param {*} timeout Connection timeout.
         * @param {*} retries Number of connection retries.
         */
        this.connect = function(timeout, retries) {
            const instance = this;
            this.isConnected = false;
            this.msgHandler = msgHandler;
            
            logConsole.LogDebug("[DaemonConnection] Connecting to wss://localhost:" + port);
            this.ws = new WebSocket("wss://localhost:" + port);

            /**
             * @method OnOpen Called when the connection is opened.
             */
            this.ws.onopen = function() {
                instance.isConnected = true;
                logConsole.LogDebug("[WebSocket->OnOpen] Connection opened.");
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
                instance.isConnected = false;
                logConsole.LogDebug("[WebSocket->OnClose] Connection is closed...");
                setTimeout(() => {
                    logConsole.LogDebug(JSON.stringify(instance));
                    instance.connect(timeout, retries)
                }, timeout);
            };
        }

        this.connect(timeout, retries);
    }
}

module.exports = {
    DaemonConnection: DaemonConnection
};