class DaemonConnection {
    constructor(port, msgHandler, timeout, retries) {
        this.connect = function(timeout, retries) {
            const instance = this;
            this.isConnected = false;
            this.msgHandler = msgHandler;
            
            logConsole.LogDebug("[DaemonConnection] Connecting to wss://localhost:" + port);
            this.ws = new WebSocket("wss://localhost:" + port);
            this.ws.onopen = function() {
                instance.isConnected = true;
                logConsole.LogDebug("[WebSocket->OnOpen] Connection opened.");
            };
    
            this.ws.onmessage = function (evt) { 
                var received_msg = evt.data;
                msgHandler(received_msg);
            };
    
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