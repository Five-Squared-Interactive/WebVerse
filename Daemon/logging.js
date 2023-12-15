const fs = require('fs');

const LOGFILEPATH = "daemon.log";

const LOGFILEENABLED = true;

module.exports = {
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