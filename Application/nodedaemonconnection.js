module.exports = function(port, msgHandler) {
    this.isConnected = false;
    this.msgHandler = msgHandler;
    
    this.ws = new WebSocket("wss://localhost:" + port);
    this.isConnected = true;
    this.ws.onopen = function() {
        
    };

    this.ws.onmessage = function (evt) {
        var received_msg = evt.data;
        msgHandler(received_msg);
    };

    this.ws.onclose = function() {
        this.isConnected = false;
        console.log("[WebSocket->OnClose] Connection is closed..."); 
    };
};