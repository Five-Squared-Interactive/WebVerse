// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const sqlite3 = require('sqlite3');

const DEFAULTMAXENTRIES = 65536;
const DEFAULTMAXENTRYLENGTH = 16384;
const DEFAULTMAXKEYLENGTH = 512;

/**
 * @class WVSettings
 * @description Class for managing the WebVerse settings.
 * @param {*} settingsDBPath Path to the settings database.
 */
module.exports = function(settingsDBPath) {

    this.db = new sqlite3.Database(settingsDBPath);

    /**
     * @method InitializeKey Initialize the value for a storage key.
     * @param {*} key Storage key.
     * @param {*} value Value.
     */
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

    /**
     * @method InitializeDB Initialize the database.
     */
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

    /**
     * @method GetStorageSetting Get a storage setting.
     * @param {*} key Key for which to get a storage setting.
     * @returns The storage setting, or null.
     */
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

    /**
     * @method ApplyStorageSetting Apply a storage setting.
     * @param {*} key Key for which to apply a storage setting.
     * @param {*} value Value to apply.
     */
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