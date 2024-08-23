// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const TabGroup = require("electron-tabs");
const fs = require('fs');
const path = require ('path');
const ApplicationSettings = require('./applicationsettings');
const DaemonConnection = require("./nodedaemonconnection");
const FocusedRuntimeHandler = require("./focusedruntimehandler");
const ipc = require('electron').ipcRenderer;

/**
 * Tab URLs.
 */
let tabURLs = {};

/**
 * History.
 */
let history = {};

/**
 * Settings.
 */
let settings = {};

/**
 * Application Settings.
 */
let applicationSettings = new ApplicationSettings("./webverse.config");
if (applicationSettings.Initialize() == false) {
  console.log("Error reading WebVerse config.");
  app.quit();
}

/**
 * Daemon Process ID.
 */
let dPID = null;

/**
 * Daemon Port.
 */
let dPort = null;

/**
 * Daemon Certificate.
 */
let dCert = null;

/**
 * Daemon Connection.
 */
let daemonConnection = null;

/**
 * Daemon ID.
 */
let daemonID = null;

/**
 * ID of the next tab.
 */
let nextTabID = 100;

/**
 * Handler for Focused Runtimes.
 */
let focusedRuntimeHandler = null;

/**
 * The Tab Group (part of Electron-Tabs).
 */
let tabGroup = null;

/**
 * Whether or not this is in debug mode.
 */
let debugMode = false;

/**
 * Set up UI events.
 */
document.getElementById("minimize-button").onclick = MinimizeApplication;
document.getElementById("maximize-button").onclick = ToggleMaximizeApplication;
document.getElementById("close-button").onclick = CloseApplication;

/**
 * Read Daemon Configuration.
 */
fs.readFile(applicationSettings.settings['daemon']['pid-file'], function(err, pidData) {
if (err) {
    console.log("Error getting Daemon PID: " + err);
}
else {
    dPID = pidData.toString();

    fs.readFile(applicationSettings.settings['daemon']['port-file'], function(err, portData) {
    if (err) {
        console.log("Error getting Daemon Port: " + err);
    }
    else {
        dPort = portData.toString();

        fs.readFile(applicationSettings.settings['daemon']['cert-file-prefix'] + dPort + '.cert', function(err, certData) {
        if (err) {
            console.log("Error getting Daemon Certificate: " + err);
        }
        else {
            dCert = certData.toString();

            daemonConnection = new DaemonConnection(portData, OnMessage);
        }
        }.bind({ tabGroup: tabGroup }));
    }
    }.bind({ tabGroup: tabGroup }));
}
}.bind({ tabGroup: tabGroup }));

/**
 * @function AddFirstTab Adds the first tab to the UI.
 */
function AddFirstTab() {
    if (debugMode) {
        tabGroup = new TabGroup({
            newTab: {
                title: 'WV Runtime',
                src: 'webverseruntimetab.html?daemon_pid=' + dPID + '&daemon_port=' + dPort
                + '&daemon_cert=' + dCert + '&main_app_id='
                + daemonID + '&tab_id=' + nextTabID
                + '&lw_runtime_path=' + path.join(__dirname, "../../" + applicationSettings.settings['lightweight-runtime'].path)
            }
        });
    }
    else {
        tabGroup = new TabGroup({
            newTab: {
                title: 'WV Runtime',
                src: 'webverseruntimetab.html?daemon_pid=' + dPID + '&daemon_port=' + dPort
                + '&daemon_cert=' + dCert + '&main_app_id='
                + daemonID + '&tab_id=' + nextTabID
                + '&lw_runtime_path=' + path.join(__dirname, applicationSettings.settings['lightweight-runtime'].path)
            }
        });
    }
    
    focusedRuntimeHandler = new FocusedRuntimeHandler(
        applicationSettings.settings["focused-runtimes"].runtimes.desktop.path,
        applicationSettings.settings["focused-runtimes"].runtimes.steamvr.path,
        applicationSettings.settings["focused-runtimes"]["storage-mode"],
        2048, 2048, 512, dPort, daemonID, applicationSettings.settings["world-load-timeout"],
        applicationSettings.settings["cache-directory"]);
    
    tab = tabGroup.addTab({
        title: 'WV Runtime',
        src: 'webverseruntimetab.html?daemon_pid=' + dPID + '&daemon_port=' + dPort
        + '&daemon_cert=' + dCert + '&main_app_id='
        + daemonID + '&tab_id=' + nextTabID
        + '&lw_runtime_path=' + path.join(__dirname, applicationSettings.settings['lightweight-runtime'].path
        + '&world_load_timeout=' + applicationSettings.settings["world-load-timeout"]
        )
    });
    nextTabID++;
    tab.activate();
}

/**
 * @function OnMessage Invoked when a Daemon Message is received.
 * @param {*} message Message.
 */
function OnMessage(message) {
    var messageContents = JSON.parse(message);
    if (messageContents.topic == null) {
            console.log("[OnMessage] Invalid message.");
            return;
    }

    if (messageContents.topic == "IDENTIFICATION-REQ") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid Identification Request.");
            return;
        }

        if (daemonID != null) {
            console.log("[OnMessage] Daemon already set up.");
            return;
        }

        var resp = {
            topic: "IDENTIFICATION-RESP",
            clientType: "WV-MAIN-APP",
            connectionID: messageContents.connectionID
        };
        connectionID = messageContents.connectionID;
        setInterval(function() { SendHeartbeat(connectionID); }, 5000);
        daemonConnection.ws.send(JSON.stringify(resp));
        daemonID = connectionID;
        AddFirstTab();
    }
    else if (messageContents.topic == "NEW-TAB-CMD") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid New Tab Command.");
            return;
        }
        if (messageContents.tabType == null) {
            console.log("[OnMessage] Invalid New Tab Command.");
            return;
        }
        CreateTab(messageContents.tabType);
    }
    else if (messageContents.topic == "FOCUSED-TAB-CMD") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid Focused Tab Command.");
            return;
        }
        if (messageContents.runtimeType == null) {
            console.log("[OnMessage] Invalid Focused Tab Command.");
            return;
        }
        if (messageContents.url == null) {
            console.log("[OnMessage] Invalid Focused Tab Command.");
            return;
        }
        LoadWorldInFocusedRuntime(messageContents.runtimeType,
            messageContents.url, history == null ? "{}" : JSON.stringify(history));
    }
    else if (messageContents.topic == "HIST-ADD-CMD") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid History Add Command.");
            return;
        }
        if (messageContents.url == null) {
            console.log("[OnMessage] Invalid History Add Command.");
            return;
        }
        AddToHistory(messageContents.url);
    }
    else if (messageContents.topic == "SET-UPD-CMD") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid Settings Update Command.");
            return;
        }
        if (messageContents.storageEntries == null) {
            console.log("[OnMessage] Invalid Settings Update Command.");
            return;
        }
        if (messageContents.storageKeyLength == null) {
            console.log("[OnMessage] Invalid Settings Update Command.");
            return;
        }
        if (messageContents.storageEntryLength == null) {
            console.log("[OnMessage] Invalid Settings Update Command.");
            return;
        }
        UpdateStorageSettings(messageContents.storageEntries,
            messageContents.storageKeyLength, messageContents.storageEntryLength);
    }
    else if (messageContents.topic == "CLOSE-CMD") {
        if (messageContents.connectionID == null) {
            console.log("[OnMessage] Invalid Close Command.");
            return;
        }
        CloseApplication();
    }
    else {
        console.log('[OnMessage] Unhandled message type.');
        return;
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
 * @function CreateTab Create a tab.
 * @param {*} type Type of tab to create ("WV-RUNTIME", "HISTORY", "SETTINGS", or "ABOUT").
 */
function CreateTab(type) {
    title = "none";
    src = "none";
    if (type == "WV-RUNTIME") {
        title = "WV Runtime";
        if (debugMode) {
            src = 'webverseruntimetab.html?daemon_pid=' + dPID + '&daemon_port='
            + dPort + '&daemon_cert=' + dCert + '&main_app_id='
            + daemonID + '&tab_id=' + nextTabID
            + '&lw_runtime_path=' + path.join(__dirname, "../../" + applicationSettings.settings['lightweight-runtime'].path
            + '&world_load_timeout=' + applicationSettings.settings["world-load-timeout"]
            );
        }
        else {
            src = 'webverseruntimetab.html?daemon_pid=' + dPID + '&daemon_port='
            + dPort + '&daemon_cert=' + dCert + '&main_app_id='
            + daemonID + '&tab_id=' + nextTabID
            + '&lw_runtime_path=' + path.join(__dirname, applicationSettings.settings['lightweight-runtime'].path
            + '&world_load_timeout=' + applicationSettings.settings["world-load-timeout"]
            );
        }
        nextTabID++;
    }
    else if (type == "HISTORY") {
        title = "History";
        if (history == null) {
            src = "history.html?history={}";
        }
        else {
            if (debugMode) {
                src = "history.html?history=" + JSON.stringify(history) + '&daemon_pid=' + dPID + '&daemon_port='
                + dPort + '&daemon_cert=' + dCert + '&main_app_id='
                + daemonID + '&tab_id=' + nextTabID
                + '&lw_runtime_path=' + path.join(__dirname, "../../" + applicationSettings.settings['lightweight-runtime'].path
                + '&world_load_timeout=' + applicationSettings.settings["world-load-timeout"]
                );
            }
            else {
                src = "history.html?history=" + JSON.stringify(history) + '&daemon_pid=' + dPID + '&daemon_port='
                + dPort + '&daemon_cert=' + dCert + '&main_app_id='
                + daemonID + '&tab_id=' + nextTabID
                + '&lw_runtime_path=' + path.join(__dirname, applicationSettings.settings['lightweight-runtime'].path
                + '&world_load_timeout=' + applicationSettings.settings["world-load-timeout"]
                );
            }
        }
    }
    else if (type == "SETTINGS") {
        title = "Settings";
        src = "settings.html?storage_entries=" + settings.maxEntries  + "&storage_key_length="
            + settings.maxKeyLength + "&storage_entry_length=" + settings.maxEntryLength + '&daemon_pid='
            + dPID + '&daemon_port=' + dPort + '&daemon_cert=' + dCert + '&main_app_id=' + daemonID;
    }
    else if (type == "ABOUT") {
        title = "About";
        src = "about.html";
    }
    else {
        console.log("[CreateTab] Unsupported tab type.");
        return;
    }

    tab = tabGroup.addTab({
        title: title,
        src: src
    });
}

/**
 * @function LoadWorldInFocusedRuntime Load the current world in a focused runtime.
 * @param {*} type Runtime type to use ("desktop" or "steamvr",
 * with "teardown" to tear down the focused runtime).
 * @param {*} url URL of world to load.
 */
function LoadWorldInFocusedRuntime(type, url) {
    if (type === "teardown") {
        focusedRuntimeHandler.CloseRuntime();
    }
    else if (type === "desktop") {
        focusedRuntimeHandler.LoadWorldInRuntime(url, "desktop", history == null ? "{}" : JSON.stringify(history));
    }
    else if (type === "steamvr") {
        focusedRuntimeHandler.LoadWorldInRuntime(url, "steamvr", history == null ? "{}" : JSON.stringify(history));
    }
}

/**
 * @function AddToHistory Add a URL to the history DB.
 * @param {*} url URL to add.
 */
function AddToHistory(url) {
    ipc.send('add-to-history', url)
}

/**
 * @function UpdateStorageSettings Update storage settings.
 * @param {*} storageEntries Maximum Storage Entries.
 * @param {*} storageKeyLength Maximum Storage Key Length.
 * @param {*} storageEntryLength Maximum Storage Entry Length.
 */
function UpdateStorageSettings(storageEntries, storageKeyLength, storageEntryLength) {
    /*settings = {
        maxEntries: storageEntries,
        maxKeyLength: storageKeyLength,
        maxEntryLength: storageEntryLength
    };*/
    ipc.send('update-settings', storageEntries, storageKeyLength, storageEntryLength);
}

/**
 * Close the main application.
 */
function CloseApplication() {
    ipc.send('close');
}

/**
 * Minimize the main application.
 */
function MinimizeApplication() {
    ipc.send('minimize');
}

/**
 * Toggle maximizing/restoring the main application.
 */
function ToggleMaximizeApplication() {
    ipc.send('toggle-maximize');
}

/**
 * Invoked on application maximize.
 */
ipc.on('maximize', function() {
    var buttonimg = document.getElementById("maximize-img");
    if (buttonimg == null) {
        console.log("Unable to get maximize image to toggle.");
        return;
    }
    buttonimg.src = "images/restore.png";
});

/**
 * Invoked on application unmaximize.
 */
ipc.on('unmaximize', function() {
    var buttonimg = document.getElementById("maximize-img");
    if (buttonimg == null) {
        console.log("Unable to get maximize image to toggle.");
        return;
    }
    buttonimg.src = "images/maximize.png";
});

/**
 * Invoked on history update.
 */
ipc.on('update-history', function(evt, hist) {
    history = hist;
});

/**
 * Invoked on settings update.
 */
ipc.on('update-settings', function(evt, set) {
    settings = set;
});