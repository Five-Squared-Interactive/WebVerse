// Copyright (c) 2019-2026 Five Squared Interactive. All rights reserved.

const { DownloaderHelper } = require('node-downloader-helper');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

/**
 * @function ExtractZip Extract a zip file to a destination, handling
 * explicit directory entries that some Unity-produced zips contain.
 * @param {string} zipPath Path to the zip file.
 * @param {string} destination Destination directory.
 */
function ExtractZip(zipPath, destination) {
    // Ensure destination exists
    fs.mkdirSync(destination, { recursive: true });

    const zip = new AdmZip(zipPath);
    // Second arg "true" overwrites existing files; "false" for third arg means
    // do not maintain entry order (faster), "true" for last would preserve permissions.
    zip.extractAllTo(destination, true);
}

/**
 * @function DownloadFiles Download Runtime Files.
 * @param {*} runtimePaths Runtime Paths.
 * @param {*} destinations Destination Paths.
 */
function DownloadFiles(runtimePaths, destinations) {
    const filePath = `${__dirname}`;

    for (let i = 0; i < runtimePaths.length; i++) {
        let runtimePath = runtimePaths[i];
        let destination = destinations[i];
        let zipFileName = runtimePath.slice(runtimePath.lastIndexOf('/') + 1);
        let zipFullPath = path.join(filePath, zipFileName);

        let dl = new DownloaderHelper(runtimePath, filePath);
        dl.on('end', () => {
            console.log("Downloaded from " + runtimePath + ".");
            console.log(destination);
            try {
                ExtractZip(zipFullPath, path.join(filePath, destination));
                console.log("Extracted " + destination + ".");
            } catch (error) {
                console.log("Error extracting " + zipFullPath + ": " + error + ".");
            }
            fs.unlink(zipFullPath, (err) => {
                if (err) {
                    console.log("Error deleting zip: " + err);
                    return;
                }
                console.log("Deleted Zip successfully.");
            });
        });
        dl.on('error', (err) => {
            console.log("Download error for " + runtimePath + ": " + err);
        });
        dl.start();
    }
}

if (process.argv.length < 4) {
    console.log("Error: At least one runtime download path and destination is required.");
} else {
    let runtimes = [];
    let destinations = [];
    for (let i = 2; i < process.argv.length; i += 2) {
        runtimes.push(process.argv[i]);
        destinations.push(process.argv[i + 1]);
    }
    DownloadFiles(runtimes, destinations);
}