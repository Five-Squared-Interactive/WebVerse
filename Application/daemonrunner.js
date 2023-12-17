// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const { spawn } = require('child_process');
const ps = require('ps-node');

/**
 * @class DaemonRunner
 * @description Class for running the WebVerse daemon.
 * @param {*} daemonProcessName Name for the daemon's process.
 * @param {*} daemonExecutable Executable for the daemon.
 */
module.exports = function(daemonProcessName, daemonExecutable) {
    /**
     * @method DoesDaemonExist Returns whether or not the daemon is running.
     * @param {*} onComplete Function to invoke when query is complete. Provides
     * a value to the function which is set to true if the daemon is running, and
     * false otherwise.
     */
    this.DoesDaemonExist = function(onComplete) {
        var result = false;
        ps.lookup({
            command: daemonProcessName,
            psargs: ''
            }, function(err, resultList) {
            if (err) {
                throw new Error(err);
            }
         
            resultList.forEach(function(process) {
                if (process) {
                    result = true;
                }
            });
            onComplete(result);
        });
    }

    /**
     * @method StartDaemon Starts the WebVerse daemon.
     */
    this.StartDaemon = function() {
        daemon = spawn(daemonExecutable, [  ],
            { shell: false, detached: true, stdio: ['ignore', 'ignore', 'ignore']});
        daemon.unref();
    }
}