// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const sqlite3 = require('sqlite3');

/**
 * @class WVHistory
 * @description Class for managing the WebVerse history.
 * @param {*} historyDBPath Path to the history database.
 */
module.exports = function(historyDBPath) {

    this.db = new sqlite3.Database(historyDBPath);

    /**
     * @method InitializeDB Initialize the database.
     */
    this.InitializeDB = function() {
        console.log("Initializing History Database.");
        ref = this;
        this.db.run("CREATE TABLE IF NOT EXISTS history(timestamp INT, site STR)", [], function(err) {
            if (err) {
                console.log("Error creating history table.");
            } else {
                console.log("History table ready.");
            }
        });
    }

    /**
     * @method AddHistoryEntry Add an entry to the history.
     * @param {*} timestamp Timestamp for the entry.
     * @param {*} site Site for the entry.
     */
    this.AddHistoryEntry = function(timestamp, site) {
        this.db.run(`INSERT INTO history
                VALUES (?, ?)`, [ timestamp, site ],
            function(err) {
                if (err) {
                    console.log("Error setting " + timestamp + ", " + site);
                }
            }
        );
    }

    /**
     * @method GetAllHistoryEntries Get all history entries.
     * @param {*} callback Callback to invoke upon result.
     * @returns The history entries, or null.
     */
    this.GetAllHistoryEntries = function(callback) {
        this.db.all("SELECT * FROM history", function(err, rows) {
            if (err) {
                console.log("Error getting history entries.");
                callback(null);
            } else {
                if (rows) {
                    callback(rows);
                } else {
                    console.log("Error getting history entries.");
                    callback(null);
                }
            }
        });
    }

    /**
     * @method GetHistoryEntry Get a history entry.
     * @param {*} timestamp Timestamp for the history entry.
     * @param {*} callback Callback to invoke upon result.
     * @returns The history entry, or null.
     */
    this.GetHistoryEntry = function(timestamp, callback) {
        this.db.get("SELECT * FROM history WHERE timestamp = ?", [ timestamp ], function(err, row) {
            if (err) {
                console.log("Error getting " + timestamp + ".");
                callback(null);
            } else {
                if (row) {
                    callback(row.value);
                } else {
                    console.log(timestamp + " does not exist.");
                    callback(null);
                }
            }
        });
    }
}