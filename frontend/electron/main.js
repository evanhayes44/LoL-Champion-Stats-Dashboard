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

ipcMain.on('window:minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
})

ipcMain.on('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
})

ipcMain.on('window:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
})

ipcMain.handle('window:is-maximized', (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false
})

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: false,
        titleBarStyle: 'hidden',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
    })

    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    win.once('ready-to-show', () => {
        win.maximize()
        win.show()
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
