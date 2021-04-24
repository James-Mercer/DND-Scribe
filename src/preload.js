import IpcCommsEvents from './Comms/IPCCommsEvents'
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require('electron')
const validChannels = [
  IpcCommsEvents.newFile,
  IpcCommsEvents.saveFile,
  IpcCommsEvents.saveAsFile,
  IpcCommsEvents.selectFileToSave
]
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
