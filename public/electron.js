const { app, BrowserWindow, ipcMain } = require('electron');
const isDevMode = require('electron-is-dev');
const { SplashScreen } = require('./splash');

const path = require('path');

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

// Create simple menu for easy devtools access, and for demo
// const menuTemplateDev = [
//   {
//     label: 'Options',
//     submenu: [
//       {
//         label: 'Open Dev Tools',
//         click() {
//           mainWindow.openDevTools();
//         },
//       },
//     ],
//   },
// ];

async function createWindow () {
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // mainWindow.loadURL(
  //   isDevMode ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  // );

  // mainWindow.webContents.on('dom-ready', () => {
  //   mainWindow.show();
  // });

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    // Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  }

  splashScreen = new SplashScreen(mainWindow, {
    imageFileName: 'logo-inner.png',
    imageFilePath: `file://${path.join(__dirname, '../build/splash_assets/')}`,
    loadUrl: isDevMode ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  });
  splashScreen.init(false);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
const webpage = require('./browser');

ipcMain.on('async', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('async-reply', 'pong')
});

ipcMain.on('crawl-async', (event, args) => {
  console.log('crawl-async', args);

  webpage(args)
    .then((response) => {
      event.reply('crawl-reply', {
        url: args.url,
        html: response.html,
        results: response.results
      });
    })
    .catch((error) => {
      event.reply('crawl-error', {
        url: args.url,
        error: error
      });
    })
});
