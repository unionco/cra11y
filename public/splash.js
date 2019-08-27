const { app, ipcMain, BrowserWindow } = require('electron');

class SplashScreen {
  constructor(mainWindow, splashOptions) {
    this.mainWindowRef = null;
    this.splashWindow = null;
    this.rootPath = app.getAppPath();

    if (!splashOptions) {
      splashOptions = {};
    }

    this.splashOptions = {
      imageFileName: splashOptions.imageFileName || 'splash.png',
      imageFilePath: splashOptions.imageFilePath || `file://${this.rootPath}/splash_assets/`,
      windowWidth: splashOptions.windowWidth || 400,
      windowHeight: splashOptions.windowHeight || 400,
      textColor: splashOptions.textColor || '#43A8FF',
      transparentWindow: splashOptions.transparentWindow || false,
      autoHideLaunchSplash: splashOptions.autoHideLaunchSplash || true,
      customHtml: splashOptions.customHtml || false,
      loadUrl: splashOptions.loadUrl || `file://${this.rootPath}/app/index.html`
    };

    this.mainWindowRef = mainWindow;

    ipcMain.on('showCapacitorSplashScreen', (event, options) => {
      this.show();
      if (options) {
        if (options.autoHide) {
          let showTime = options.showDuration || 3000;
          setTimeout(() => {
            this.hide();
          }, showTime);
        }
      }
    });

    ipcMain.on('hideCapacitorSplashScreen', (event, options) => {
      this.hide();
    });
  }

  init() {
    this.splashWindow = new BrowserWindow({
      width: this.splashOptions.windowWidth,
      height: this.splashOptions.windowHeight,
      frame: false,
      show: false,
      transparent: this.splashOptions.transparentWindow,
    });

    let splashHtml = `
      <html style="width: 100%; height: 100%; margin: 0; overflow: hidden;">
        <body style="margin: 0;">
          <div class="Logo">
            <img class="Logo-inner" src="./${this.splashOptions.imageFileName}" alt="logo" />
          </div>
          <style>
          .Logo {
            align-items: center;
            background-color: rgb(21,81,150);
            display: flex;
            height: ${this.splashOptions.windowHeight}px;
            justify-content: center;
            position: relative;
            width: ${this.splashOptions.windowWidth}px;
            overflow: hidden;
          }
          img {
            animation: roll 1.5s ease-in-out infinite forwards;
            max-width: 100%;
            position: relative;
            transform: translate3d(-100%, 0, 0);
          }
          @keyframes roll {
            0% {
              transform: translate3d(-100%, 0, 0);
            }
            50% {
              transform: rotate(0deg) translate3d(0, 0, 0);
            }
            55% {
              transform: rotate(-5deg) translate3d(0, 0, 0);
            }
            60% {
              transform: rotate(0deg) translate3d(0, 0, 0);
            }
            100% {
              transform: rotate(0deg) translate3d(100%, 0, 0);
            }
          }
          </style>
        </body>
      </html>
    `;

    this.mainWindowRef.on('closed', () => {
      this.splashWindow.close();
    });

    this.splashWindow.loadURL(`data:text/html;charset=UTF-8,${splashHtml}`, { baseURLForDataURL: this.splashOptions.imageFilePath });

    this.splashWindow.webContents.on('dom-ready', async () => {
      this.splashWindow.show();
      setTimeout(async () => {
        this.mainWindowRef.loadURL(this.splashOptions.loadUrl);
      }, 2000);
    });

    if (this.splashOptions.autoHideLaunchSplash) {
      this.mainWindowRef.webContents.on('dom-ready', () => {
        this.mainWindowRef.show();
        this.splashWindow.hide();
      });
    }
  }

  show() {
    this.splashWindow.show();
    this.mainWindowRef.hide();
  }

  hide() {
    this.mainWindowRef.show();
    this.splashWindow.hide();
  }
}

module.exports = {
  SplashScreen
};
