const TabGroup = require("electron-tabs");
const fs = require('fs');
const ApplicationSettings = require('./applicationsettings');
const DaemonConnection = require("./nodedaemonconnection");
const FocusedRuntimeHandler = require("./focusedruntimehandler");
const ipc = require('electron').ipcRenderer;

let tabURLs = {};

let applicationSettings = new ApplicationSettings("./webverse.config");
if (applicationSettings.Initialize() == false) {
  console.log("Error reading WebVerse config.");
  app.quit();
}

let dPID = null;

let dPort = null;

let dCert = null;

let daemonConnection = null;

let daemonID = null;

let nextTabID = 100;

let focusedRuntimeHandler = null;

let tabGroup = new TabGroup({
    newTab: {
        title: 'New Tab',
        src: 'index.html?daemon_pid=' + dPID + '&daemon_port=' + dPort
        + '&daemon_cert=' + dCert + '&main_app_id='
        + daemonID + '&tab_id=' + nextTabID
        + '&lw_runtime_path=' + applicationSettings.settings['lightweight-runtime'].path
    }
});

document.getElementById("minimize-button").onclick = MinimizeApplication;
document.getElementById("maximize-button").onclick = ToggleMaximizeApplication;
document.getElementById("close-button").onclick = CloseApplication;

//fs.readFile('../Daemon/webverse-daemon-pid.dat', function(err, pidData) {
fs.readFile('webverse-daemon-pid.dat', function(err, pidData) {
if (err) { 
    console.log("Error getting Daemon PID: " + err);
}
else {
    dPID = pidData.toString();

    //fs.readFile('../Daemon/webverse-daemon-port.dat', function(err, portData) {
    fs.readFile('webverse-daemon-port.dat', function(err, portData) {
    if (err) {
        console.log("Error getting Daemon Port: " + err);
    }
    else {
        dPort = portData.toString();

        //fs.readFile('../Daemon/webverse-daemon-connection-' + dPort + '.cert', function(err, certData) {
        fs.readFile('webverse-daemon-connection-' + dPort + '.cert', function(err, certData) {
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

function AddFirstTab() {
    focusedRuntimeHandler = new FocusedRuntimeHandler(
        applicationSettings.settings["focused-runtimes"].runtimes.desktop.path,
        applicationSettings.settings["focused-runtimes"].runtimes.steamvr.path,
        applicationSettings.settings["focused-runtimes"]["storage-mode"],
        2048, 2048, 512, dPort, daemonID);
    
    tab = tabGroup.addTab({
        title: 'New Tab',
        src: 'index.html?daemon_pid=' + dPID + '&daemon_port=' + dPort
        + '&daemon_cert=' + dCert + '&main_app_id='
        + daemonID + '&tab_id=' + nextTabID
        + '&lw_runtime_path=' + applicationSettings.settings['lightweight-runtime'].path
    });
    nextTabID++;
    tab.activate();
}

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
        LoadWorldInFocusedRuntime(messageContents.connectionID,
            messageContents.runtimeType, messageContents.url);
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

function SendHeartbeat(connectionID) {
    var heartbeat = {
        topic: "HEARTBEAT",
        connectionID: connectionID
    };
    daemonConnection.ws.send(JSON.stringify(heartbeat));
}

function CreateTab(type) {
    title = "none";
    src = "none";
    if (type == "WV-RUNTIME") {
        title = "New Tab";
        src = 'index.html?daemon_pid=' + dPID + '&daemon_port='
        + dPort + '&daemon_cert=' + dCert + '&main_app_id='
        + daemonID + '&tab_id=' + nextTabID
        + '&lw_runtime_path=' + applicationSettings.settings['lightweight-runtime'].path;
        nextTabID++;
    }
    else if (type == "HISTORY") {
        title = "History";
        src = "history.html";
    }
    else if (type == "SETTINGS") {
        title = "Settings";
        src = "settings.html";
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

function LoadWorldInFocusedRuntime(connectionID, type, url) {
    if (type === "teardown") {
        focusedRuntimeHandler.CloseRuntime();
    }
    else if (type === "desktop") {
        console.log("swdf");
        focusedRuntimeHandler.LoadWorldInRuntime(url, "desktop");
    }
    else if (type === "steamvr") {
        focusedRuntimeHandler.LoadWorldInRuntime(url, "steamvr");
    }
}

function CloseApplication() {
    ipc.send('close');
}

function MinimizeApplication() {
    ipc.send('minimize');
}

function ToggleMaximizeApplication() {
    ipc.send('toggle-maximize');
}

ipc.on('maximize', function() {
    var buttonimg = document.getElementById("maximize-img");
    if (buttonimg == null) {
        console.log("Unable to get maximize image to toggle.");
        return;
    }
    buttonimg.src = "images/restore.png";
});

ipc.on('unmaximize', function() {
    var buttonimg = document.getElementById("maximize-img");
    if (buttonimg == null) {
        console.log("Unable to get maximize image to toggle.");
        return;
    }
    buttonimg.src = "images/maximize.png";
});

function RegisterMaximizeToggleEvents() {
    ipc.send('toggle-maximize-event', function() {
        var buttonimg = document.getElementById("maximize-img");
        if (buttonimg == null) {
            console.log("[RegisterMaximizeToggleEvents] Unable to get maximize image to toggle.");
            return;
        }
        buttonimg.src = "images/maximize.png";
    });

    ipc.send('toggle-restore-event', function() {
        var buttonimg = document.getElementById("maximize-img");
        if (buttonimg == null) {
            console.log("[RegisterMaximizeToggleEvents] Unable to get maximize image to toggle.");
            return;
        }
        buttonimg.src = "images/restore.png";
    });
}