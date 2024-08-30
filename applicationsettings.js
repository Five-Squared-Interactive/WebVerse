// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const { readFileSync } = require('fs');

/**
 * @class ApplicationSettings
 * @description Class for reading application settings config file.
 * @param {*} configFilePath Path to the application settings config file.
 */
module.exports = function(configFilePath) {
    this.settings = null;

    /**
     * @method Initialize
     * @description Initialize the application settings object.
     * @returns Whether or not the initialization succeeded.
     */
    this.Initialize = function() {
        cfgFileData = readFileSync(configFilePath);
        if (cfgFileData === null) {
            console.error("[ApplicationSettings->Initialize] Unable to load settings.");
            return false;
        }

        this.settings = JSON.parse(cfgFileData);
        if (this.settings === null) {
            console.error("[ApplicationSettings->Intialize] Error deserializing settings.");
            return false;
        }

        return true;
    }
}