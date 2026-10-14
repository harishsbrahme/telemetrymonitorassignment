const { app, BrowserWindow } = require('electron');

const devUrl = 'http://localhost:4200';
const path = require('path');

const useBuild = app.isPackaged || process.env.USE_BUILD === '1';

let frontendFolder = path.join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser');
let backendFile = path.join(__dirname, '..', '..', 'backend', 'src', 'server.js');

if (app.isPackaged) {
  frontendFolder = path.join(process.resourcesPath, 'app-frontend');
  backendFile = path.join(process.resourcesPath, 'app-backend', 'src', 'server.js');
}

function startBackend() {
  try {
    require(backendFile);
  } catch (error) {
    console.error('Backend failed to start', error);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Telemetry Monitor',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (useBuild) {
    startBackend();
    win.loadFile(path.join(frontendFolder, 'index.html'));
    return;
  }

  win.loadURL(devUrl);
}

app.whenReady().then(function () {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  app.quit();
});
