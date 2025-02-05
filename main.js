// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const electron = require('electron');
const { autoUpdater } = require("electron-updater")
const path = require('path');
const ApplicationSettings = require('./applicationsettings');
const RuntimeHandler = require('./runtimehandler');
const app = electron.app;
const globalShortcut = electron.globalShortcut;

/**
 * Main window.
 */
let mainWindow = null;

/**
 * Application settings.
 */
let applicationSettings = null;
applicationSettings = new ApplicationSettings("./webverse.config");
if (applicationSettings.Initialize() == false) {
  console.log("Error reading WebVerse config.");
  app.quit();
}
if (applicationSettings.settings['desktop-runtime'] == null ||
  applicationSettings.settings['desktop-runtime']['path'] == null) {
    console.log("Error getting desktop runtime path.");
    app.quit();
}

/**
 * Runtime handler.
 */
let runtimeHandler = null;
runtimeHandler = new RuntimeHandler(applicationSettings.settings['desktop-runtime']['path']);

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
    StartWebVerseLauncher();

    runtimeHandler.LoadRuntime();

    /**
     * Auto-updating.
     */
    autoUpdater.checkForUpdatesAndNotify();

    //app.quit();
});

/**
 * Handle update not available.
 */
autoUpdater.on('update-not-available', (info) => {
  app.quit();
});

/**
 * Handle error.
 */
autoUpdater.on('error', (err) => {
  app.quit();
});

/**
 * Handle update downloaded.
 */
autoUpdater.on('update-downloaded', (info) => {
  app.quit();
});

/**
 * @function StartWebVerse Start WebVerse.
 */
function StartWebVerseLauncher() {
  console.log("Starting WebVerse Launcher.");

    mainWindow = new electron.BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js'),
        devTools: false,
        titleBarStyle: "hidden"
      },
      icon: __dirname + "/images/Webverse.png",
      frame: false,
      width: 390,
      height: 200,
      resizable: false,
      transparent: true
    });
    mainWindow.center();
    mainWindow.loadURL('file://' + __dirname + '/launcher.html');
    mainWindow.on('ready-to-show', function () {
      mainWindow.show();
      mainWindow.focus();
    });
}