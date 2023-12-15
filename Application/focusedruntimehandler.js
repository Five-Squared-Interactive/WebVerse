const { spawn } = require('child_process');

module.exports = function(desktopRuntimePath, steamVRRuntimePath, storageMode,
    maxEntries, maxEntryLength, maxKeyLength, daemonPort, mainAppID) {
    var runtime = null;
    
    this.LoadWorldInRuntime = function(worldURI, mode) {
        CloseRuntime();
        if (mode == "desktop") {
            console.log("uri=" + worldURI + " storagemode=" + storageMode + " maxentries=" + maxEntries +
            " maxentrylength=" + maxEntryLength + " maxkeylength=" + maxKeyLength + "daemonport=" + daemonPort +
            "mainappid=" + mainAppID);
            runtime = spawn(desktopRuntimePath, [ "uri=" + worldURI,
                "storagemode=" + storageMode, "maxentries=" + maxEntries,
                "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=10" ]);
        }
        else if (mode == "steamvr") {
            runtime = spawn(steamVRRuntimePath, [ "uri=" + worldURI,
                "storagemode=" + storageMode, "maxentries=" + maxEntries,
                "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=11" ]);
        }
        else {
            console.error("[FocusedRuntimeHandler->LoadWorldInRuntime] Unknown mode.");
        }
    }

    this.CloseRuntime = function() {
        CloseRuntime();
    }

    function CloseRuntime() {
        if (runtime != null) {
            runtime.kill();
        }
    }
};