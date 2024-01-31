// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const electron = require('electron');
const { autoUpdater } = require("electron-updater")
const path = require('path');
const ApplicationSettings = require('./applicationsettings');
const WVSettings = require('./wvsettings');
const WVHistory = require('./wvhistory');
const DaemonRunner = require('./daemonrunner');
const ipcMain = electron.ipcMain;
const app = electron.app;
const globalShortcut = electron.globalShortcut;

/**
 * Main window.
 */
let mainWindow = null;

/**
 * Flag for ignoring first certificate error (for daemon connection).
 */
let certificateErrorIgnored = false;

/**
 * Auto-updating
 */
autoUpdater.checkForUpdatesAndNotify();

/**
 * Application settings.
 */
let applicationSettings = null;
applicationSettings = new ApplicationSettings("./webverse.config");
if (applicationSettings.Initialize() == false) {
  console.log("Error reading WebVerse config.");
  app.quit();
}

/**
 * Initialize WebVerse History.
 */
wvHistory = new WVHistory(applicationSettings.settings['history-db'].path);
wvHistory.InitializeDB();

/**
 * Initialize WebVerse Settings.
 */
wvSettings = new WVSettings(applicationSettings.settings['settings-db'].path);
wvSettings.InitializeDB();

/**
 * Handle certificate error.
 */
app.on ("certificate-error", (event, webContents, url, error, cert, callback) => {
  if (url.startsWith("wss://127.0.0.1") || url.startsWith("wss://localhost")) {
    /*
    Note: In the future, the daemon's certificate should be properly verified. However,
    the certificate error exception is only being made once, at startup. Therefore,
    this band-aid should be sufficient for now.
    */
      if (true) {//certificateErrorIgnored === false) {
        certificateErrorIgnored = true;
        event.preventDefault();
        callback(true);
      } else callback(false);
  } else callback (false);
});

/**
 * Disable reload shortcut.
 */
app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
      console.log("F5 is pressed: Shortcut Disabled");
  });
});

/**
 * Handle application ready.
 */
app.on('ready', function () {
  const daemonRunner = new DaemonRunner(applicationSettings.settings.daemon['process-name'],
    applicationSettings.settings.daemon['daemon-executable']);
  daemonRunner.DoesDaemonExist(function(res) {
    if (res == true) {
      console.log("Daemon found.");
      StartBrowserWindow();
    } else {
      console.log("Daemon not found. Starting.");
      daemonRunner.StartDaemon();

      console.log("Waiting 1 second for daemon to start...");
      setTimeout(function() {
        daemonRunner.DoesDaemonExist(function(res) {
          if (res == true) {
            console.log("Daemon found.");
            StartBrowserWindow();
          } else {
            console.log("Daemon not found. Waiting 5 seconds for daemon to start...");
            setTimeout(function() {
              daemonRunner.DoesDaemonExist(function(res) {
                if (res == true) {
                  console.log("Daemon found.");
                  StartBrowserWindow();
                } else {
                  console.log("Daemon not found. Waiting 10 seconds for daemon to start...");
                  setTimeout(function() {
                    daemonRunner.DoesDaemonExist(function(res) {
                      if (res == true) {
                        console.log("Daemon found.");
                        StartBrowserWindow();
                      } else {
                        console.log("Daemon not found. Aborting.");
                        app.quit();
                      }
                    });
                  });
                }
              });
            });
          }
        });
      }, 1000);
    }
  });
});

/**
 * Handle IPC close message.
 */
ipcMain.on('close', () => {
  app.quit();
});

/**
 * Handle IPC minimize message.
 */
ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

/**
 * Handle IPC toggle-maximize message.
 */
ipcMain.on('toggle-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

/**
 * Handle IPC add to history message.
 */
ipcMain.on('add-to-history', (evt, url) => {
  wvHistory.AddHistoryEntry(Date.now(), url);
  SendHistory();
  
});

ipcMain.on('update-settings', (evt, entries, keyLen, entryLen) => {
  wvSettings.ApplyStorageSetting("MAXENTRIES", entries);
  wvSettings.ApplyStorageSetting("MAXKEYLENGTH", keyLen);
  wvSettings.ApplyStorageSetting("MAXENTRYLENGTH", entryLen);
  SendSettings();
});

/**
 * @function StartBrowserWindow Start the browser window.
 */
function StartBrowserWindow() {
  console.log("Daemon started. Starting application.");

    mainWindow = new electron.BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js'),
        devTools: false
      },
      icon: __dirname + "/images/Webverse.png",
      frame: false,
      width: 720,
      height: 480,
      minWidth: 720,
      minHeight: 390
    });
    mainWindow.loadURL('file://' + __dirname + '/tabholder.html');
    mainWindow.on('ready-to-show', function () {
      mainWindow.show();
      mainWindow.focus();
      SendHistory();
      SendSettings();
    });
    mainWindow.on('maximize', function() {
      mainWindow.webContents.send('maximize');
    });
    mainWindow.on('unmaximize', function() {
      mainWindow.webContents.send('unmaximize');
    });
}

/**
 * @function SendHistory Send the current history to the tab holder.
 */
function SendHistory() {
  wvHistory.GetAllHistoryEntries((result) => {
    if (result == null) {
      // Ignore, don't overwrite current history.
    }
    else {
      mainWindow.webContents.send('update-history', result);
    }
  });
}

/**
 * @function SendSettings Send the current settings to the tab holder.
 */
function SendSettings() {
  settingsObj = {
    maxEntries: 8,
    maxKeyLength: 128,
    maxEntryLength: 256
  };

  wvSettings.GetStorageSetting("MAXENTRIES", (maxEntries) => {
    settingsObj.maxEntries = maxEntries;
    wvSettings.GetStorageSetting("MAXKEYLENGTH", (maxKeyLength) => {
      settingsObj.maxKeyLength = maxKeyLength;
      wvSettings.GetStorageSetting("MAXENTRYLENGTH", (maxEntryLength) => {
        settingsObj.maxEntryLength = maxEntryLength;
        mainWindow.webContents.send('update-settings', settingsObj);
      });
    });
  });
}