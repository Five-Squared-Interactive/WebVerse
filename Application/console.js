// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

/**
 * @class Console
 * @description Class for the in-app console.
 */
class Console {
    /**
     * @constructor Constructor for the in-app console.
     * @param {*} textID ID of the text field for console messages.
     */
    constructor(textID)
    {
        this.console = document.getElementById(textID);
    }

    /**
     * @method LogDebug Log a debug message.
     * @param {*} message The message to log.
     */
    LogDebug(message) {
        if (this.console == null) {
            console.error("[Console->LogDebug] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [DEBUG]: " + message;
    }

    /**
     * @method LogDebug Log a normal message.
     * @param {*} message The message to log.
     */
    LogMessage(message) {
        if (this.console == null) {
            console.error("[Console->LogMessage] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + ": " + message;
    }

    /**
     * @method LogDebug Log a warning message.
     * @param {*} message The message to log.
     */
    LogWarning(message) {
        if (this.console == null) {
            console.error("[Console->LogWarning] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [WARN]: " + message;
    }

    /**
     * @method LogDebug Log an error message.
     * @param {*} message The message to log.
     */
    LogError(message) {
        if (this.console == null) {
            console.error("[Console->LogError] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [ERROR]: " + message;
    }
}