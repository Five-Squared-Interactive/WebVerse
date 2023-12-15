const electron = require('electron');
const path = require('path');
const ApplicationSettings = require('./applicationsettings');
const WVSettings = require('./wvsettings');
const WVHistory = require('./wvhistory');
const DaemonRunner = require('./daemonrunner');
const ipcMain = electron.ipcMain;
const app = electron.app;

let mainWindow = null;
let applicationSettings = null;

applicationSettings = new ApplicationSettings("./webverse.config");
if (applicationSettings.Initialize() == false) {
  console.log("Error reading WebVerse config.");
  app.quit();
}
    
wvHistory = new WVHistory(applicationSettings.settings['history-db'].path);
wvHistory.InitializeDB();
wvSettings = new WVSettings(applicationSettings.settings['settings-db'].path);
wvSettings.InitializeDB();

app.on ("certificate-error", (event, webContents, url, error, cert, callback) => {
  if (url.startsWith("wss://127.0.0.1") || url.startsWith("wss://localhost")) {
      if (true) { // TODO: Verify certificate.
        event.preventDefault();
        callback(true);
      } else callback(false);
  } else callback (false);
});

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

ipcMain.on('close', () => {
  app.quit();
});

ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('toggle-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

function StartBrowserWindow() {
  console.log("Daemon started. Starting application.");

    mainWindow = new electron.BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: __dirname + "/images/Webverse.png",
      frame: false,
      width: 720,
      height: 480,
      minWidth: 720,
      minHeight: 390
    });
    mainWindow.loadURL('file://' + __dirname + '/electron-tabs.html');
    mainWindow.on('ready-to-show', function () {
      mainWindow.show();
      mainWindow.focus();
    });
    mainWindow.on('maximize', function() {
      mainWindow.webContents.send('maximize');
    });
    mainWindow.on('unmaximize', function() {
      mainWindow.webContents.send('unmaximize');
    });
}