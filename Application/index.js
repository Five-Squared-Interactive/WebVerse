let logConsole = new Console("console-text");

let daemonPID = null;
let daemonPort = null;
let daemonCert = null;
let mainAppID = null;
let tabViewMode = "unfocused";
let tabID = null;
let lightweightRuntimePath = null;
UpdateTabViewMode();

window.addEventListener("keydown", (event) => {
    if (event.code == "F12") {
        ToggleConsole();
    }
});

window.addEventListener("click", (event) => {
    if (!document.getElementById("menu").contains(event.target) &&
        !document.getElementById("urlmenu").contains(event.target)) {
        CloseURLMenu();
    }

    if (!document.getElementById("focus").contains(event.target) &&
        !document.getElementById("focusmenu").contains(event.target)) {
        CloseFocusMenu();
    }
});

document.getElementById("input").addEventListener("keypress", (event) => {
    input = document.getElementById("input");
    var inp = String.fromCharCode(event.key);
    if (/[a-zA-Z0-9-_ ]/.test(inp)
        || event.key == "/" || event.key == ":"
        || event.key == ".") {
    }
    else if (event.key == "Enter") {
        RunURL();
    }
    else if (event.key == "Backspace") {
        input.value = input.value.slice(0, -1);
    }
});

function GetDaemonInfo() {
    params = new URLSearchParams(window.location.search)
    daemonPID = params.get("daemon_pid");
    daemonPort = params.get("daemon_port");
    daemonCert = params.get("daemon_cert");
    mainAppID = params.get("main_app_id");
    tabID = params.get("tab_id");
    lightweightRuntimePath = params.get("lw_runtime_path");
}

GetDaemonInfo();

let daemonConnection = new DaemonConnection(daemonPort, HandleMessage, 3000, 5);
let connectionID = null;

function RecordURL() {
    activeTab = tabGroup.getActiveTab();
    if (activeTab != null) {
        SaveURLValue(activeTab);
    }
}

function SaveURLValue(tab) {
    input = document.getElementById("input");
    if (input != null) {
        tabURLs[tab] = input.value;
    }
}

function AddTab() {
    SendNewTabRequest("NEWTAB");
}

function OpenHistory() {
    SendNewTabRequest("HISTORY");
}

function OpenSettings() {
    SendNewTabRequest("SETTINGS");
}

function OpenAbout() {
    SendNewTabRequest("ABOUT");
}

function CloseApplication() {
    SendCloseRequest();
}

function ToggleConsole() {
    var cons = document.getElementById("console");
    if (cons.style.display === "block") {
        cons.style.display = "none";
    } else {
        cons.style.display = "block";
    }
}

function KeyDown(event) {
    input = document.getElementById("input");
    var inp = String.fromCharCode(event.key);
    document.getElementById("input").value = event.key;
    if (/[a-zA-Z0-9-_ ]/.test(inp)
        || event.key == "/" || event.key == ":"
        || event.key == ".") {
    }
    else if (event.key == "Enter") {
        RunURL();
    }
    else if (event.key == "Backspace") {
        input.value = input.value.slice(0, -1);
    }
}

function RunURL() {
    url = document.getElementById("input").value;

    // Make sure URL is prepended with a protocol.
    fixedURL = url;
    if (url.startsWith("http://") == false && url.startsWith("https://") == false
        && url.startsWith("file://") == false && url.startsWith("ftp://") == false) {
        fixedURL = "https://" + url;
        document.getElementById("input").value = fixedURL;
    }

    fetch(fixedURL).then((response) => {
        contentType = response.headers.get("Content-Type");
        if (contentType.includes("text/html")) {
            // HTML document. Load in Chromium.
            document.getElementById("runtime-container").src = fixedURL;
        } else {
            // Assume WebVerse-compatible format.
            document.getElementById("runtime-container").src =
                lightweightRuntimePath + "?main_app_id="
                + mainAppID + "&daemon_port=" + daemonPort
                + "&max_entries=2048&max_entry_length=2048&max_key_length=512&tab_id=100&world_url=" + fixedURL;
        }
    }).catch((reason) => {
        logConsole.LogWarning(reason);
    });
}

function ToggleURLMenu() {
    var click = document.getElementById("urlmenu");
    if (click.style.display === "block") {
        click.style.display = "none";
    } else {
        click.style.display = "block";
    }
}

function ToggleFocusMenu() {
    var click = document.getElementById("focusmenu");
    if (click.style.display === "block") {
        click.style.display = "none";
    } else {
        click.style.display = "block";
    }
}

function CloseURLMenu() {
    var click = document.getElementById("urlmenu");
    click.style.display = "none";
}

function CloseFocusMenu() {
    var click = document.getElementById("focusmenu");
    click.style.display = "none";
}

function HandleMessage(message) {
    var messageContents = JSON.parse(message);
    if (messageContents.topic == null) {
        logConsole.LogError("[HandleMessage] Invalid message.");
        return;
    }

    if (messageContents.topic == "IDENTIFICATION-REQ") {
        if (messageContents.connectionID == null) {
            logConsole.LogError("[HandleMessage] Invalid Identification Request.");
            return;
        }
        var resp = {
            topic: "IDENTIFICATION-RESP",
            clientType: "WV-RUNTIME",
            connectionID: messageContents.connectionID,
            windowID: mainAppID
        };
        connectionID = messageContents.connectionID;
        setInterval(function() { SendHeartbeat(connectionID); }, 5000);
        daemonConnection.ws.send(JSON.stringify(resp));
    }
}

function SendHeartbeat(connectionID) {
    var heartbeat = {
        topic: "HEARTBEAT",
        connectionID: connectionID
    };
    daemonConnection.ws.send(JSON.stringify(heartbeat));
}

function SendNewTabRequest(kind) {
    if (daemonConnection == null) {
        logConsole.LogError("[SendNewTabRequest] No Daemon Connection.");
        return;
    }

    if (daemonConnection.isConnected != true) {
        logConsole.LogError("[SendNewTabRequest] Daemon is not connected.");
        return;
    }

    tabType = "none";
    if (kind == "NEWTAB") {
        tabType = "WV-RUNTIME";
    }
    else if (kind == "HISTORY") {
        tabType = "HISTORY";
    }
    else if (kind == "SETTINGS") {
        tabType = "SETTINGS";
    }
    else if (kind == "ABOUT") {
        tabType = "ABOUT";
    }
    else {
        logConsole.LogError("[SendNewTabRequest] Unknown tab type.");
        return;
    }

    var request = {
        topic: "NEW-TAB-REQ",
        connectionID: connectionID,
        tabType: tabType
    };
    daemonConnection.ws.send(JSON.stringify(request));
}

function SendLoadWorldRequest(worldURI) {
    if (daemonConnection == null) {
        logConsole.LogError("[SendLoadWorldRequest] No Daemon Connection.");
        return;
    }

    if (daemonConnection.isConnected != true) {
        logConsole.LogError("[SendLoadWorldRequest] Daemon is not connected.");
        return;
    }

    var request = {
        topic: "LOAD-WORLD-REQ",
        connectionID: connectionID,
        url: worldURI
    };
    daemonConnection.ws.send(JSON.stringify(request));
}

function SendCloseRequest() {
    if (daemonConnection == null) {
        logConsole.LogError("[SendCloseRequest] No Daemon Connection.");
        return;
    }

    if (daemonConnection.isConnected != true) {
        logConsole.LogError("[SendCloseRequest] Daemon is not connected.");
        return;
    }

    var request = {
        topic: "CLOSE-REQ",
        connectionID: connectionID
    };
    daemonConnection.ws.send(JSON.stringify(request));
}

function SelectViewMode(mode) {
    runtimeType = null;
    
    switch (mode) {
        case "unfocused":
            if (tabViewMode == "unfocused") {
                logConsole.Log("[SelectViewMode] Tab already in unfocused mode.");
                break
            }
            runtimeType = "teardown";
            tabViewMode = "unfocused";
            RunURL();
        break;
        
        case "focused":
            if (tabViewMode == "focused") {
                logConsole.Log("[SelectViewMode] Tab already in focused mode.");
                break;
            }
            runtimeType = "desktop";
            tabViewMode = "focused";
            document.getElementById("runtime-container").src = "focusedmode.html";
        break;

        case "steamvr":
            if (tabViewMode == "steamvr") {
                logConsole.Log("[SelectViewMode] Tab already in steamvr mode.");
                break;
            }
            runtimeType = "steamvr";
            tabViewMode = "steamvr";
            document.getElementById("runtime-container").src = "focusedmode.html";
        break;

        default:
        logConsole.LogError("[SelectViewMode] Unknown view mode.");
        break;
    }
    
    if (runtimeType != null) {
        if (daemonConnection == null) {
            logConsole.LogError("[SelectViewMode] No Daemon Connection.");
            return;
        }
    
        if (daemonConnection.isConnected != true) {
            logConsole.LogError("[SelectViewMode] Daemon is not connected.");
            return;
        }
        
        url = document.getElementById("input").value;

        // Make sure URL is prepended with a protocol.
        fixedURL = url;
        if (url.startsWith("http://") == false && url.startsWith("https://") == false
            && url.startsWith("file://") == false && url.startsWith("ftp://") == false) {
            fixedURL = "https://" + url;
            document.getElementById("input").value = fixedURL;
        }

        var request = {
            topic: "FOCUSED-TAB-REQ",
            connectionID: connectionID,
            type: runtimeType,
            url: fixedURL
        };
        
        daemonConnection.ws.send(JSON.stringify(request));
        UpdateTabViewMode();
    }
}

function UpdateTabViewMode() {
    document.getElementById("unfocused").style = "background-color: rgb(127, 127, 127, 0.79)";
    document.getElementById("focused").style = "background-color: rgb(127, 127, 127, 0.79)";
    document.getElementById("steamvr").style = "background-color: rgb(127, 127, 127, 0.79)";
    switch (tabViewMode) {
        case "unfocused":
        document.getElementById("unfocused").style = "background-color: rgb(71, 144, 142, 128)";
        break;
        
        case "focused":
        document.getElementById("focused").style = "background-color: rgb(71, 144, 142, 128)";
        break;

        case "steamvr":
        document.getElementById("steamvr").style = "background-color: rgb(71, 144, 142, 128)";
        break;

        default:
        logConsole.LogError("[UpdateTabViewMode] Unknown view mode.");
        break;
    }
}