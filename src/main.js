const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

try {
	require('electron-reloader')(module);
} catch {}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '/index.html'));
  mainWindow.webContents.openDevTools();
  
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', () => {
  ipcMain.handle('dialog:openFile', handleFileOpen);
});

async function handleFileOpen(event, filePath) {
  if (!filePath) {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (canceled) {
      return;
    }
    filePath = filePaths[0];
  }

  const fileAnalyser = new FileAnalyser(filePath);
  return fileAnalyser.analyze();
}

class FileAnalyser {
  constructor(filePath) {
    this.filePath = filePath;
  }

  analyze() {
    const domoticzDatabase = new DomoticzDatabase(this.filePath);
    if (domoticzDatabase.isMatch())
    {
      return new FileAnalyserResponse(this.filePath, 'Found Domoticz', domoticzDatabase.error);
    }
  
    return new FileAnalyserResponse(this.filePath, 'Unknown filetype', domoticzDatabase.error);
  }
}

class FileAnalyserResponse {
  constructor(filePath, message, error) {
    this.filePath = filePath;
    this.message = message;
    this.error = error;
  }
}

class DomoticzDatabase {
  constructor(filePath) {
    this.filePath = filePath;
  }

  setupDatabase() {
    if (!this.filePath) {
      throw 'no file path';
    }

    if (!this.filePath.endsWith('.db')) {
      throw 'not ending with .db'
    }

    this.database = new Database(this.filePath, { verbose: console.log });
  }

  isMatch() {
    try {
      this.setupDatabase();
      const tablesSql = `SELECT name FROM sqlite_schema WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY 1`;
      const tables = this.database.prepare(tablesSql).all();
      this.error = tables;
      if (!tables.find((value) => { value.name == 'DeviceStatus' })) {
        throw { message: 'could not find DeviceStatus table', tables };
      }


      //const valuesSql = `select * from DeviceStatus`;
      //const values = this.database.prepare(valuesSql).all();
      //this.error = values;
      return false;
    } catch (error) {
      this.error = error;
      return false;
    }
  }
}