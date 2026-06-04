const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    getCache: () => ipcRenderer.invoke('cache:get'),
    setCache: (data) => ipcRenderer.invoke('cache:set', data)
})