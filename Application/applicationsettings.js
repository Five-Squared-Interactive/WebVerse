const { readFileSync } = require('fs');

module.exports = function(configFilePath) {
    this.settings = null;

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