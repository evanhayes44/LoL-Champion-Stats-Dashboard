import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const cachePath = path.join(app.getPath('userData'), 'champions-cache.json')

ipcMain.handle('cache:get', () => {
    try {
        if (!fs.existsSync(cachePath)) return null
        const raw = fs.readFileSync(cachePath, 'utf-8')
        return JSON.parse(raw)
    } catch {
        return null
    }
})

ipcMain.handle('cache:set', (event, data) => {
    try {
        fs.writeFileSync(cachePath, JSON.stringify(data))
    } catch {
        // fail silently — caching is an optimization, not critical
    }
})

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
    })

    // app.isPackaged is false when running with `electron .` in dev,
    // and true when distributed via electron-builder.
    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    // macOS: re-create the window when the dock icon is clicked and no windows are open
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Windows/Linux: quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
