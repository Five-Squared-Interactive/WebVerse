const { DownloaderHelper } = require('node-downloader-helper');
const decompress = require("decompress");
const fs = require("fs");

function DownloadFiles(runtimePaths, destinations) {
    const filePath = `${__dirname}`;

    for (i = 0; i < runtimePaths.length; i++) {
        let runtimePath = runtimePaths[i];
        let destination = destinations[i];
        dl = new DownloaderHelper(runtimePath, filePath);
        dl.on('end', () => {
            console.log("Downloaded from " + runtimePath + ".");
            console.log(destination);
            decompress(filePath + "/" + runtimePath.slice(runtimePath.lastIndexOf('/') + 1), destination)
            .then((files) => {
                console.log("Extracted " + destination + ".");
                fs.unlink(filePath + "/" + runtimePath.slice(runtimePath.lastIndexOf('/') + 1), (err) => {
                    if (err) {
                        throw err;
                    }
                
                    console.log("Deleted Zip successfully.");
                });
            })
            .catch((error) => {
                console.log("Error extracting " + filePath + "/"
                + runtimePath.slice(runtimePath.lastIndexOf('/') + 1) + ": " + error + ".");
                fs.unlink(filePath + "/" + runtimePath.slice(runtimePath.lastIndexOf('/') + 1), (err) => {
                    if (err) {
                        throw err;
                    }
                
                    console.log("Deleted Zip successfully.");
                });
            });
        });
        dl.start();
    }
}

if (process.argv.length < 4) {
    console.log("Error: At least one runtime download path and destination is required.");
} else {
    runtimes = [];
    destinations = [];
    for (i = 2; i < process.argv.length; i+= 2) {
        runtimes.push(process.argv[i]);
        destinations.push(process.argv[i + 1]);
    }
    DownloadFiles(runtimes, destinations);
}