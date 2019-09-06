const electron = require('electron');
const Store = require('electron-store');
const store = new Store();

window.ipcRenderer = electron.ipcRenderer;
window.shell = electron.shell;
window.estore = store;
