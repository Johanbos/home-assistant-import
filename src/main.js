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
      const entities = domoticzDatabase.entities();
      return new FileAnalyserResponse(this.filePath, 'Found Domoticz', domoticzDatabase.error, entities);
    }
  
    return new FileAnalyserResponse(this.filePath, 'Unknown filetype', domoticzDatabase.error);
  }
}

class FileAnalyserResponse {
  constructor(filePath, message, error, entities) {
    this.filePath = filePath;
    this.message = message;
    this.error = error;
    this.entities = entities;
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
      const tablesNeeded = ['DeviceStatus', 'Hardware', 'Meter_Calendar'];
      if (!tablesNeeded.every((tableName) => { return tables.find((value) => { return value.name == tableName }) })) {
        throw { message: 'Could not find all Domoticz tables', tablesNeeded, tables };
      }
      return true;
    } catch (error) {
      this.error = error;
      return false;
    }
  }

  entities() {
    const entitiesSql = 
      `select m.DeviceRowID EntityID, h.Name || ' ' || d.Name DeviceName, min(m.Date) StartDate, max(m.Date) EndDate, count(*) TotalValues, min(m.Counter) MinValues, max(m.Counter) MaxValues
 from Meter_Calendar m 
 left join DeviceStatus d on d.ID = m.DeviceRowID
 left join Hardware h on h.ID = d.HardwareID
 group by m.DeviceRowID

 union all

 select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter1), max(m.Counter1)
 from MultiMeter_Calendar m 
 left join DeviceStatus d on d.ID = m.DeviceRowID
 left join Hardware h on h.ID = d.HardwareID
 where m.Counter1 <> 0
 group by DeviceRowID

 union all

 select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter2), max(m.Counter2)
 from MultiMeter_Calendar m 
 left join DeviceStatus d on d.ID = m.DeviceRowID
 left join Hardware h on h.ID = d.HardwareID
 where m.Counter2 <> 0
 group by DeviceRowID

 union all

 select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter3), max(m.Counter3)
 from MultiMeter_Calendar m 
 left join DeviceStatus d on d.ID = m.DeviceRowID
 left join Hardware h on h.ID = d.HardwareID
 where m.Counter3 <> 0
 group by DeviceRowID

 union all

 select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter4), max(m.Counter4)
 from MultiMeter_Calendar m 
 left join DeviceStatus d on d.ID = m.DeviceRowID
 left join Hardware h on h.ID = d.HardwareID
 where m.Counter4 <> 0
 group by DeviceRowID
 `;
    const entities = this.database.prepare(entitiesSql).all();
    return entities;
  }
}