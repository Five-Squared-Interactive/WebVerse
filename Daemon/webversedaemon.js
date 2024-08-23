// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const fs = require('fs');
const WebSocketServer = require('./websocketserver');
const CertificateGenerator = require('./certificategenerator');
const DaemonMessages = require('./daemonmessages');
const FindFreePorts = require('find-free-ports');
const { exit } = require('process');
const OS = require('os');
const { v4: uuidv4 } = require('uuid');
const Logging = require('./logging');

/**
 * @module WebVerseDaemon WebVerse Daemon.
 */
module.exports = function() {
    /**
     * Clients.
     */
    var clients = {};

    /**
     * Client Main Applications.
     */
    var clientMainApps = {};

    /**
     * Client Tabs.
     */
    var clientTabs = {};

    /**
     * Client Heartbeat Timers.
     */
    var clientHeartbeatTimers = {};

    /**
     * WebSocket Interfaces.
     */
    var wsis = {};

    /**
     * Main Applications.
     */
    var mainApps = [];

    /**
     * Client Timeout.
     */
    const clientTimeout = 30;

    /**
     * Hostname.
     */
    this.hostname = OS.hostname();
    
    /**
     * PID.
     */
    this.pid = process.pid;

    /**
     * Certificate Information.
     */
    this.certInfo = CertificateGenerator.GenerateCertificateAndKey(this.hostname + '.webverse.info');
    
    /**
     * Daemon Port.
     */
    this.port = null;
    FindFreePorts().then((foundPort) => {
        if (foundPort == null) {
            Logging.Log("[WebVerse Daemon] Unable to find port.");
            exit(1);
        }
        this.port = foundPort[0];

        fs.writeFileSync(`.webverse-daemon-pid.dat`, this.pid.toString());
        fs.writeFileSync(`.webverse-daemon-port.dat`, this.port.toString());
        fs.writeFileSync(`.webverse-daemon-connection-${this.port}.cert`, this.certInfo.certificate);

        setInterval(function() { CheckHeartbeatTimers() }, 5000);

        WebSocketServer.CreateWebSocketServer(this.port, this.certInfo, OnConnected, OnMessage);
    });

    /**
     * @function OnConnected Invoked upon connection.
     * @param {*} wsi WebSocket Interface.
     */
    function OnConnected(wsi) {
        Logging.Log("[WebVerse Daemon] Client connected. Exchanging handshake.");

        let connID = uuidv4();

        wsi.send(JSON.stringify(DaemonMessages.IdentificationRequest(connID)));
        wsis[connID] = wsi;
    }

    /**
     * @function OnMessage Invoked upon receiving message.
     * @param {*} data Data.
     */
    function OnMessage(data) {
        if (data == null) {
            Logging.Log("[WebVerse Daemon] Invalid data.");
            return;
        }
        
        let message = JSON.parse(data);
        HandleMessage(message);
    }

    /**
     * @function HandleMessage Handle a message.
     * @param {*} data Data.
     */
    function HandleMessage(data) {
        if (data.topic == null) {
            Logging.Log("[WebVerse Daemon->HandleMessage] Invalid message.");
            return;
        }
    
        if (data.topic == "IDENTIFICATION-RESP") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Identification response missing parameter: connectionID.");
                return;
            }
            if (data.clientType == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Identification response missing parameter: clientType.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] Identification response message received. Adding client.");
            AddClient(data.connectionID, data.windowID, data.tabID, data.clientType);
        }
        else if (data.topic == "HEARTBEAT") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Heartbeat message missing parameter: connectionID.");
                return;
            }
            //Logging.Log("[WebVerse Daemon->HandleMessage] Heartbeat message received.");
            ProcessHeartbeat(data.connectionID);
        }
        else if (data.topic == "NEW-TAB-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] New Tab request missing parameter: connectionID.");
                return;
            }
            if (data.tabType == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] New Tab request missing parameter: tabType.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] New Tab request received.");
            ProcessNewTabRequest(data.connectionID, data.tabType);
        }
        else if (data.topic == "FOCUSED-TAB-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Focused Tab request missing parameter: connectionID.");
                return;
            }

            if (data.type == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Focused Tab request missing parameter: type.");
                return;
            }

            if (data.url == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Focused Tab request missing parameter: url.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] Focused Tab request received.");
            ProcessFocusedTabRequest(data.connectionID, data.type, data.url);
        }
        else if (data.topic == "LOAD-WORLD-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Load World request missing parameter: connectionID.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] Load World request received.");
            ProcessLoadWorldRequest(data.connectionID, data.url);
        }
        else if (data.topic == "HIST-ADD-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] History Add request missing parameter: connectionID.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] History Add request received.");
            ProcessHistoryAddRequest(data.connectionID, data.url);
        }
        else if (data.topic == "SET-UPD-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Settings Update request missing parameter: connectionID.");
                return;
            }

            if (data.storageEntries == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Settings Update request missing parameter: StorageEntries.");
                return;
            }

            if (data.storageKeyLength == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Settings Update request missing parameter: StorageKeyLength.");
                return;
            }

            if (data.storageEntryLength == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Settings Update request missing parameter: StorageEntryLength.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] Settings Update request received.");

            ProcessSettingsUpdateRequest(data.connectionID, data.storageEntries, data.storageKeyLength, data.storageEntryLength);
        }
        else if (data.topic == "CLOSE-REQ") {
            if (data.connectionID == null) {
                Logging.Log("[WebVerse Daemon->HandleMessage] Close request missing parameter: connectionID.");
                return;
            }
            Logging.Log("[WebVerse Daemon->HandleMessage] Close request received.");
            ProcessCloseRequest(data.connectionID);
        }
        else {
            Logging.Log('[WebVerse Daemon->HandleMessage] Unhandled message type.');
            return;
        }
    }

    /**
     * @function AddClient Add a client.
     * @param {*} connectionID Connection ID.
     * @param {*} windowID Window ID.
     * @param {*} tabID Tab ID.
     * @param {*} clientType Client Type.
     */
    function AddClient(connectionID, windowID, tabID, clientType) {
        if (clients.hasOwnProperty(connectionID)) {
            Logging.Log('[WebVerse Daemon->AddClient] Client ' + connectionID + ' already exists.');
            return;
        }

        clients[connectionID] = clientType;
        clientTabs[connectionID] = tabID;
        clientHeartbeatTimers[connectionID] = 0;
        if (clientType == "WV-MAIN-APP") {
            for (mainApp in mainApps) {
                if (mainApp == connectionID) {
                    Logging.Log("[WebVerse Daemon->AddClient] Attempting to add a main app, but it already exists.");
                    return;
                }
            }
            mainApps.push(connectionID);
        }
        else {
            clientMainApps[connectionID] = windowID;
        }
    }

    /**
     * @function RemoveClient Remove a client.
     * @param {*} connectionID Connection ID.
     */
    function RemoveClient(connectionID) {
        if (!clients.hasOwnProperty(connectionID)) {
            Logging.Log('[WebVerse Daemon->RemoveClient] Client ' + connectionID + ' does not exist.');
            return;
        }
        
        delete clients[connectionID];
        delete clientHeartbeatTimers[connectionID];
        delete clientMainApps[connectionID];
    }

    /**
     * @function ProcessHeartbeat Process a Heartbeat.
     * @param {*} connectionID Connection ID.
     */
    function ProcessHeartbeat(connectionID) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessHeartbeat] Received heartbeat for unknown connection ID: ' + connectionID);
            return;
        }

        clientHeartbeatTimers[connectionID] = 0;
    }

    /**
     * @function ProcessNewTabRequest Process a New Tab Request.
     * @param {*} connectionID Connection ID.
     * @param {*} type Tab Type.
     */
    function ProcessNewTabRequest(connectionID, type) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessNewTabRequest] Received new tab request for unknown connection ID: ' + connectionID);
            return;
        }

        if (clients[connectionID] == "WV-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessNewTabRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.NewTabCommand(mainApps[mainApp], type)));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessNewTabRequest] Could not find main app.');
        }
        else {
            Logging.Log("[WebVerse Daemon->ProcessNewTabRequest] Client cannot request a new tab.");
        }
    }

    /**
     * @function ProcessFocusedTabRequest Process a Focused Tab Request.
     * @param {*} connectionID Connection ID.
     * @param {*} type Tab Type.
     * @param {*} url Tab URL.
     */
    function ProcessFocusedTabRequest(connectionID, type, url) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessFocusedTabRequest] Received focused tab request for unknown connection ID: ' + connectionID);
            return;
        }

        if (clients[connectionID] == "WV-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessFocusedTabRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.FocusedTabCommand(mainApps[mainApp], type, url)));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessFocusedTabRequest] Could not find main app.');
        }
        else if (clients[connectionID] == "WV-FOCUSED-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessFocusedTabRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.FocusedTabCommand(mainApps[mainApp], type, url)));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessFocusedTabRequest] Could not find main app.');
        }
        else {
            Logging.Log("[WebVerse Daemon->ProcessFocusedTabRequest] Client cannot request a focused tab.");
        }
    }

    /**
     * @function ProcessLoadWorldRequest Process a Load World Request.
     * @param {*} connectionID Connection ID.
     * @param {*} url World URL.
     */
    function ProcessLoadWorldRequest(connectionID, url) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessLoadWorldRequest] Received load world request for unknown connection ID: ' + connectionID);
            return;
        }
    }

    /**
     * @function ProcessHistoryAddRequest Process a History Add Request.
     * @param {*} connectionID Connection ID.
     * @param {*} url Tab URL.
     */
    function ProcessHistoryAddRequest(connectionID, url) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessHistoryAddRequest] Received history add request for unknown connection ID: ' + connectionID);
            return;
        }

        if (clients[connectionID] == "WV-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessHistoryAddRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.HistoryAddCommand(mainApps[mainApp], url)));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessHistoryAddRequest] Could not find main app.');
        }
        else {
            Logging.Log("[WebVerse Daemon->ProcessHistoryAddRequest] Client cannot request to add to history.");
        }
    }

    /**
     * @function ProcessSettingsUpdateRequest Process a Settings Update Request.
     * @param {*} connectionID Connection ID.
     * @param {*} storageEntries Maximum Storage Entries.
     * @param {*} storageKeyLength Maximum Storage Key Length.
     * @param {*} storageEntryLength Maximum Storage Entry Length.
     */
    function ProcessSettingsUpdateRequest(connectionID, storageEntries, storageKeyLength, storageEntryLength) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessSettingsUpdateRequest] Received settings update request for unknown connection ID: ' + connectionID);
            return;
        }

        if (clients[connectionID] == "WV-SETTINGS") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessSettingsUpdateRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.SettingsUpdateCommand(mainApps[mainApp],
                            storageEntries, storageKeyLength, storageEntryLength)));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessSettingsUpdateRequest] Could not find main app.');
        }
        else {
            Logging.Log("[WebVerse Daemon->ProcessSettingsUpdateRequest] Client cannot request to update settings.");
        }
    }

    /**
     * @function ProcessCloseRequest Process a Close Request.
     * @param {*} connectionID Connection ID.
     */
    function ProcessCloseRequest(connectionID) {
        if (!clientHeartbeatTimers.hasOwnProperty(connectionID) || clientHeartbeatTimers[connectionID] == null) {
            Logging.Log('[WebVerse Daemon->ProcessCloseRequest] Received close request for unknown connection ID: ' + connectionID);
            return;
        }

        if (clients[connectionID] == "WV-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessCloseRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.CloseCommand(connectionID, mainApps[mainApp])));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessCloseRequest] Could not find main app.');
        }
        else if (clients[connectionID] == "WV-FOCUSED-RUNTIME") {
            for (mainApp in mainApps) {
                if (mainApps[mainApp] == clientMainApps[connectionID]) {
                    if (wsis[mainApps[mainApp]] == null) {
                        Logging.Log('[WebVerse Daemon->ProcessCloseRequest] No WS connection for main app.');
                    }
                    else {
                        wsis[mainApps[mainApp]].send(JSON.stringify(DaemonMessages.CloseCommand(connectionID, mainApps[mainApp])));
                    }
                    return;
                }
            }
            Logging.Log('[WebVerse Daemon->ProcessCloseRequest] Could not find main app.');
        }
        else {
            Logging.Log("[WebVerse Daemon->ProcessCloseRequest] Client cannot request the application close.");
        }
    }

    /**
     * @function CheckHeartbeatTimers Check Heartbeat Timers.
     */
    function CheckHeartbeatTimers() {
        for (timer in clientHeartbeatTimers) {
            if (clientHeartbeatTimers[timer] == null) {
                
            }
            else {
                clientHeartbeatTimers[timer] += 5;
                if (clientHeartbeatTimers[timer] > clientTimeout) {
                    Logging.Log("[WebVerse Daemon->CheckHeartbeatTimers] Client " + timer + " timed out.");
                    RemoveClient(timer);
                }
            }
        }
    }
}