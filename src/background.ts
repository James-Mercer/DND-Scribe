'use strict'

import { app, protocol, BrowserWindow, Menu, dialog, ipcMain, IpcMainEvent } from 'electron'
import path from 'path'
import store from './store/index'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import IPCCommEvents from './Comms/IPCCommsEvents'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const isMac: boolean = process.platform === 'darwin'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let window: BrowserWindow;

async function createWindow () {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: true,
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

function initMenu(): void {
  const menuTemplate: any =  [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    //File
    { 
      label: 'File',
      submenu: [
        { 
          label: 'New', 
          click: fileNew 
        },
        {
          label: 'Open',
          click: fileOpen
        },
        {
          label: 'Save',
          click: fileSave
        },
        {
          label: 'Save as',
          click: fileSaveAs
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    //Edit
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
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    //view
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
    //Window
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
    ...( isDevelopment ? 
    //Help
    [{
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

function fileNew(menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  if (browserWindow) {
    browserWindow.webContents.send(IPCCommEvents.newFile, ["Test arguments"])
  }
}

function fileOpen(menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent): void {
  const dialogOptions: Electron.OpenDialogOptions = { 
    title: menuItem.label, 
    properties: !isMac ? ['openFile', 'promptToCreate'] : ['openFile', 'createDirectory'] 
  }
  if (browserWindow) {
    dialog.showOpenDialog(dialogOptions).then((response: Electron.OpenDialogReturnValue) => {
      if (!response.canceled) {
        // handle fully qualified file name
        browserWindow.webContents.send(IPCCommEvents.loadFile)
      } else {
        console.log("no file selected");
      }
    })
  }
}

function fileSave (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent) {
  if (browserWindow) {
    browserWindow.webContents.send(IPCCommEvents.saveFile)
  }
}

function fileSaveAs (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow | undefined, event: Electron.KeyboardEvent) {
  const dialogOptions: Electron.SaveDialogOptions = { 
    title: menuItem.label,    
  }
  if (browserWindow) {
    dialog.showSaveDialog(dialogOptions).then((response: Electron.SaveDialogReturnValue): void => {
      if (!response.canceled) {
        // handle fully qualified file name
        console.log(response.filePath);
        browserWindow.webContents.send(IPCCommEvents.saveAsFile, response.filePath)
      } else {
        console.log("no file selected");
      }
    })
  }
  
}

// IPC Main comms
ipcMain.on(IPCCommEvents.selectFileToSave, (event: IpcMainEvent, args: any[]) => {
  //if save was called but there is no previous path to save to make the user select one
  const dialogOptions: Electron.SaveDialogOptions = { 
    title: 'Save File'   
  }
  dialog.showSaveDialog(dialogOptions).then((response: Electron.SaveDialogReturnValue) => {
    if(!response.canceled){
      console.log(response.filePath)
      //BrowserWindow.webContents.send(IPCCommEvents.saveAsFile, response.filePath)
    } else {
      console.log('No File was selected')
    }
  })
})
