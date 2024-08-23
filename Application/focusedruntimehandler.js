// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const { spawn } = require('child_process');

/**
 * @class Class that handles the focused runtime process.
 * @param {*} desktopRuntimePath Path to the desktop runtime executable.
 * @param {*} steamVRRuntimePath Path to the SteamVR runtime executable.
 * @param {*} storageMode Mode to use for storage.
 * @param {*} maxEntries Maximum storage entries to use.
 * @param {*} maxEntryLength Maximum storage entry length to use.
 * @param {*} maxKeyLength Maximum storage entry key length to use.
 * @param {*} daemonPort Daemon port to use.
 * @param {*} mainAppID Main application's ID.
 * @param {*} worldLoadTimeout World load timeout.
 * @param {*} filesDirectory Files directory.
 */
module.exports = function(desktopRuntimePath, steamVRRuntimePath, storageMode,
    maxEntries, maxEntryLength, maxKeyLength, daemonPort, mainAppID,
    worldLoadTimeout, filesDirectory) {
    var runtime = null;
    
    var debugMode = false;

    /**
     * @method LoadWorldInRuntime Loads a given world in a focused runtime.
     * @param {*} worldURI URI to the world.
     * @param {*} mode Type of runtime to use.
     * @param {*} historyString History string to use.
     */
    this.LoadWorldInRuntime = function(worldURI, mode, historyString) {
        CloseRuntime();
        if (mode == "desktop") {
            if (debugMode) {
                runtime = spawn(desktopRuntimePath, [ "uri=" + worldURI,
                    "storagemode=" + storageMode, "maxentries=" + maxEntries,
                    "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                    "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=10",
                    "worldloadtimeout=" + worldLoadTimeout, "filesdirectory=" + "../../Application/" + filesDirectory,
                    "history=" + historyString ]);
            }
            else {
                runtime = spawn(desktopRuntimePath, [ "uri=" + worldURI,
                    "storagemode=" + storageMode, "maxentries=" + maxEntries,
                    "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                    "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=10",
                    "worldloadtimeout=" + worldLoadTimeout, "filesdirectory=" + filesDirectory,
                    "history=" + historyString ]);
            }
        }
        else if (mode == "steamvr") {
            if (debugMode) {
                runtime = spawn(steamVRRuntimePath, [ "uri=" + worldURI,
                    "storagemode=" + storageMode, "maxentries=" + maxEntries,
                    "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                    "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=11",
                    "worldloadtimeout=" + worldLoadTimeout, "filesdirectory=" + "../../Application/" + filesDirectory,
                    "history=" + historyString ]);
            }
            else {
                runtime = spawn(steamVRRuntimePath, [ "uri=" + worldURI,
                    "storagemode=" + storageMode, "maxentries=" + maxEntries,
                    "maxentrylength=" + maxEntryLength, "maxkeylength=" + maxKeyLength,
                    "daemonport=" + daemonPort, "mainappid=" + mainAppID, "tabid=11",
                    "worldloadtimeout=" + worldLoadTimeout, "filesdirectory=" +  filesDirectory,
                    "history=" + historyString ]);
            }
        }
        else {
            console.error("[FocusedRuntimeHandler->LoadWorldInRuntime] Unknown mode.");
        }
    }

    /**
     * @method CloseRuntime Close any runtimes.
     */
    this.CloseRuntime = function() {
        CloseRuntime();
    }

    /**
     * @method CloseRuntime Close any runtimes.
     */
    function CloseRuntime() {
        if (runtime != null) {
            runtime.kill();
        }
    }
};