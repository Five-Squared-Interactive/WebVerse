/**
 * The Daemon PID.
 */
let daemonPID = null;

/**
 * The Daemon Port.
 */
let daemonPort = null;

/**
 * The Daemon Certificate.
 */
let daemonCert = null;

/**
 * The Main App ID.
 */
let mainAppID = null;

let storageEntries = null;
let storageKeyLength = null;
let storageEntryLength = null;

GetQueryParams();

/**
 * Establish the daemon connection.
 */
let daemonConnection = new DaemonConnection(daemonPort, HandleMessage, 3000, 5, false);

ApplyInitialStorageSettings();

function GetQueryParams() {
    params = new URLSearchParams(window.location.search)
    storageEntries = params.get("storage_entries");
    storageKeyLength = params.get("storage_key_length");
    storageEntryLength = params.get("storage_entry_length");
    daemonPID = params.get("daemon_pid");
    daemonPort = params.get("daemon_port");
    daemonCert = params.get("daemon_cert");
    mainAppID = params.get("main_app_id");
}

function ApplyInitialStorageSettings() {
    var sEntriesField = document.getElementById("sentries");
    var sKeyLenField = document.getElementById("skeylen");
    var sEntryLenField = document.getElementById("sentrylen");

    if (sEntriesField == null || sKeyLenField == null || sEntryLenField == null) {
        console.log("Error: Unable to get all fields.");
        return;
    }

    if (storageEntries == null) {
        console.log("Error: Storage Entries invalid.");
        return;
    }

    if (storageKeyLength == null) {
        console.log("Error: Storage Key Length invalid.");
        return;
    }

    if (storageEntryLength == null) {
        console.log("Error: Storage Entry Length invalid.");
        return;
    }

    sEntriesField.value = parseInt(storageEntries);
    sKeyLenField.value = parseInt(storageKeyLength);
    sEntryLenField.value = parseInt(storageEntryLength);
}

function UpdateStorageSettings() {
    var sEntriesField = document.getElementById("sentries");
    var sKeyLenField = document.getElementById("skeylen");
    var sEntryLenField = document.getElementById("sentrylen");

    if (sEntriesField == null || sKeyLenField == null || sEntryLenField == null) {
        console.log("Error: Unable to get all fields.");
        return;
    }
    
    newStorageEntriesValue = parseInt(sEntriesField.value);
    newStorageKeyLenValue = parseInt(sKeyLenField.value);
    newStorageEntryLenValue = parseInt(sEntryLenField.value);
    
    if (newStorageEntriesValue < 1 || newStorageEntriesValue >= 262144) {
        console.log("Error: Invalid Storage Entries value.");
        return;
    }
    
    if (newStorageKeyLenValue < 5 || newStorageKeyLenValue >= 8192) {
        console.log("Error: Invalid Storage Key Length value.");
        return;
    }
    
    if (newStorageEntryLenValue < 9 || newStorageEntryLenValue >= 131072) {
        console.log("Error: Invalid Storage Entry Length value.");
        return;
    }
    
    SendSettingsUpdateRequest(newStorageEntriesValue, newStorageKeyLenValue, newStorageEntryLenValue);
}

/**
 * @function HandleMessage Handle a daemon message.
 * @param {*} message Message.
 */
function HandleMessage(message) {
    var messageContents = JSON.parse(message);
    if (messageContents.topic == null) {
        console.log("[HandleMessage] Invalid message.");
        return;
    }

    if (messageContents.topic == "IDENTIFICATION-REQ") {
        if (messageContents.connectionID == null) {
            console.log("[HandleMessage] Invalid Identification Request.");
            return;
        }
        var resp = {
            topic: "IDENTIFICATION-RESP",
            clientType: "WV-SETTINGS",
            connectionID: messageContents.connectionID,
            windowID: mainAppID
        };
        connectionID = messageContents.connectionID;
        setInterval(function() { SendHeartbeat(connectionID); }, 5000);
        daemonConnection.ws.send(JSON.stringify(resp));
    }
}

/**
 * @function SendHeartbeat Send a daemon heartbeat.
 * @param {*} connectionID Connection ID for which to send the heartbeat.
 */
function SendHeartbeat(connectionID) {
    var heartbeat = {
        topic: "HEARTBEAT",
        connectionID: connectionID
    };
    daemonConnection.ws.send(JSON.stringify(heartbeat));
}

/**
 * @function SendSettingsUpdateRequest Send a settings update request.
 * @param {*} sEntries Storage Entries.
 * @param {*} sKeyLength Storage Key Length.
 * @param {*} sEntryLength Storage Entry Length.
 */
function SendSettingsUpdateRequest(sEntries, sKeyLength, sEntryLength) {
    if (daemonConnection == null) {
        console.log("[SendSettingsUpdateRequest] No Daemon Connection.");
        return;
    }

    if (daemonConnection.isConnected != true) {
        console.log("[SendSettingsUpdateRequest] Daemon is not connected.");
        return;
    }

    if (sEntries == null || sKeyLength == null || sEntryLength == null) {
        console.log("[SendSettingsUpdateRequest] Null parameter.");
        return;
    }

    if (sEntries < 1 || sEntries >= 262144) {
        console.log("[SendSettingsUpdateRequest] Invalid sEntries parameter.");
        return;
    }

    if (sKeyLength < 5 || sKeyLength >= 8192) {
        console.log("[SendSettingsUpdateRequest] Invalid sKeyLength parameter.");
        return;
    }

    if (sEntryLength < 9 || sEntryLength >= 131072) {
        console.log("[SendSettingsUpdateRequest] Invalid sEntryLength parameter.");
        return;
    }

    var request = {
        topic: "SET-UPD-REQ",
        connectionID: connectionID,
        storageEntries: sEntries,
        storageKeyLength: sKeyLength,
        storageEntryLength: sEntryLength
    };
    daemonConnection.ws.send(JSON.stringify(request));
}