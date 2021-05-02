'use strict'

import { app, protocol, BrowserWindow, Menu, dialog, ipcMain, IpcMainEvent, SaveDialogOptions, OpenDialogOptions, FileFilter } from 'electron'
import fs from 'fs'
import path from 'path'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import IpcCommEvents from './Comms/IPCCommsEvents'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import Campaign from '@/types/Campaign'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isMac: boolean = process.platform === 'darwin'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let window: BrowserWindow

async function createWindow () {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true, // (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    window.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  initMenu()
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function initMenu (): void {
  const menuTemplate: any = [
    ...(isMac ? [{
      label: app.name,
      submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'services' }, { type: 'separator' }, { role: 'hide' },
        { role: 'hideothers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }]
    }] : []),
    // File
    {
      label: 'File',
      submenu: [
        { label: 'New', click: menuNew },
        { label: 'Open', click: menuOpen },
        { label: 'Save', click: menuSave },
        { label: 'Save as', click: menuSaveAs },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // Edit
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // view
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // Window
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    ...(isDevelopment
    // Help
      ? [{
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              const { shell } = require('electron')
              await shell.openExternal('https://electronjs.org')
            }
          }
        ]
      }] : [])
  ]
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function menuNew (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  if (browserWindow) {
    console.log('menu item new clicked')
    browserWindow.webContents.send(IpcCommEvents.newCampaign, [])
  } else {
    dialog.showErrorBox('Error', 'Electron Window invalid')
  }
}

function menuOpen (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  if (browserWindow) {
    console.log(browserWindow)
    const defaultDir = app.getPath('documents')
    const openDialogOptions: OpenDialogOptions = {
      title: '',
      filters: [{ name: 'json', extensions: ['json'] }],
      properties: ['openFile', 'createDirectory', 'promptToCreate']
    }
    const filepath: string[]|undefined = dialog.showOpenDialogSync(browserWindow, openDialogOptions)
    if (!filepath) { return }

    browserWindow.webContents.send(IpcCommEvents.openCampaignFromObject, filepath)
  } else {
    dialog.showErrorBox('Error', 'Electron Window invalid')
  }
}

function menuSave (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  if (browserWindow) {
    console.log(browserWindow)
    browserWindow.webContents.send(IpcCommEvents.saveCurrentFile)
  } else {
    dialog.showErrorBox('Error', 'Electron Window invalid')
  }
}

function menuSaveAs (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  if (browserWindow) {
    const dir: string = app.getPath('documents')
    const saveDialogOptions: SaveDialogOptions = {
      title: 'Save Campaign',
      buttonLabel: 'save',
      filters: [{ name: 'json', extensions: ['json'] }],
      properties: ['createDirectory', 'showOverwriteConfirmation']
    }
    if (dir) {
      saveDialogOptions.defaultPath = dir
    }
    const path: string|undefined = dialog.showSaveDialogSync(browserWindow, saveDialogOptions)
    if (!path) {
      return
    }
    (browserWindow as any).electron.send(IpcCommEvents.saveCampaignToFile, [path])
  } else {
    dialog.showErrorBox('Error', 'Electron Window invalid')
  }
}

// IPC Main comms
ipcMain.on(IpcCommEvents.saveFile, (event: IpcMainEvent, args: any[]) => {
  console.log('IPC - Save file')
  console.log(event)
  console.log(args)
  try {
    fs.writeFileSync(args[0], args[1], 'utf-8')
  } catch {

  }
})

ipcMain.on(IpcCommEvents.openFile, (event: IpcMainEvent, args: any[]) => {
  console.log('IPC - Open File')
  console.log(event)
  console.log(args)
  const window: BrowserWindow|undefined = BrowserWindow.getAllWindows().find((win: BrowserWindow) => {
    return win.id === args[2]
  })
  console.log('Main = open')
  try {
    const filePath: string = args[0]
    if (!fs.existsSync(filePath)) {
      throw 'File does not exist'
    }

    const obj: Campaign = JSON.parse(fs.readFileSync(args[0], 'utf-8'))
    if ((window as any).electron) {
      console.log('electron api found')
    } else {
      console.log('electron api not found')
    }
  } catch {

  }
})
