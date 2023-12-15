const sqlite3 = require('sqlite3');

const DEFAULTMAXENTRIES = 65536;
const DEFAULTMAXENTRYLENGTH = 16384;
const DEFAULTMAXKEYLENGTH = 512;

module.exports = function(settingsDBPath) {

    this.db = new sqlite3.Database(settingsDBPath);

    this.InitializeKey = function(key, value) {
        this.db.get("SELECT * FROM storage WHERE key = ?", [ key ], function(err, row) {
            if (err) {
                console.log("Error checking " + key + ".");
            } else {
                if (row) {
                    console.log(key + " = " + String(row.value));
                } else {
                    console.log(key + " not set. Setting to default.");
                    this.db.run("INSERT INTO storage(key, value) VALUES(?, ?)", [ key, value ]);
                }
            }
        });
    }

    this.InitializeDB = function() {
        console.log("Initializing Settings Database.");
        ref = this;
        this.db.run("CREATE TABLE IF NOT EXISTS storage(key STR, value INT)", [], function(err) {
            if (err) {
                console.log("Error creating storage table.");
            } else {
                ref.InitializeKey("MAXENTRIES", DEFAULTMAXENTRIES);
                ref.InitializeKey("MAXENTRYLENGTH", DEFAULTMAXENTRYLENGTH);
                ref.InitializeKey("MAXKEYLENGTH", DEFAULTMAXKEYLENGTH);
            }
        });
    }

    this.GetStorageSetting = function(key) {
        this.db.get("SELECT * FROM storage WHERE key = ?", [ key ], function(err, row) {
            if (err) {
                console.log("Error getting " + key + ".");
            } else {
                if (row) {
                    return row.value;
                } else {
                    console.log(key + " not set.");
                    return null;
                }
            }
        });
    }

    this.ApplyStorageSetting = function(key, value) {
        this.db.run(`UPDATE storage
                SET value = ?
                WHERE key = ?`, [ value, key ],
            function(err) {
                if (err) {
                    console.log("Error setting " + key);
                }
            }
        );
    }
}