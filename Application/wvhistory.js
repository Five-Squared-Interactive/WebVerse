const sqlite3 = require('sqlite3');

module.exports = function(historyDBPath) {

    this.db = new sqlite3.Database(historyDBPath);

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

    this.GetAllHistoryEntries = function() {
        this.db.all("SELECT * FROM history", function(err, rows) {
            if (err) {
                console.log("Error getting history entries.");
            } else {
                if (rows) {
                    return rows;
                } else {
                    console.log("Error getting history entries.");
                    return null;
                }
            }
        });
    }

    this.GetHistoryEntry = function(timestamp) {
        this.db.get("SELECT * FROM history WHERE timestamp = ?", [ timestamp ], function(err, row) {
            if (err) {
                console.log("Error getting " + timestamp + ".");
            } else {
                if (row) {
                    return row.value;
                } else {
                    console.log(timestamp + " does not exist.");
                    return null;
                }
            }
        });
    }
}