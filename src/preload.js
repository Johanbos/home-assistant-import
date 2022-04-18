// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    createImport: (filePath, entityId) => ipcRenderer.invoke('createImport', filePath, entityId)
})