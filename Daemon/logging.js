// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const fs = require('fs');

const LOGFILEPATH = "daemon.log";

const LOGFILEENABLED = true;

/**
 * @module Logging Logging class.
 */
module.exports = {
    /**
     * @function Log Log a message.
     * @param {*} message Message to log.
     */
    Log: function(message) {
        console.log(message);
        if (LOGFILEENABLED) {
            fs.appendFile(LOGFILEPATH, Date(Date.now()) + ": " + message + "\n", (error) => {
                if (error) {
                    console.log("Error appending to log: " + err);
                }
            });
        }
    }
};