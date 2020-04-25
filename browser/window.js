'use strict'

const { BrowserWindow } = require('electron');

// default window settings
const defaultProps = {
  width: 800,
  height: 800,
  show: true,

  // update for electron V5+
  webPreferences: {
    nodeIntegration: true
  }
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, windowSettings});

    // loiad the html and open devtools
    this.loadFile(file);
    this.webContents.openDevTools();

    // gracefully show when ready to prevent flickering
    this.once('read-to-show', () => {
      this.show();
    });
  }
}

module.exports = Window;
