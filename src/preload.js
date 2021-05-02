import IpcCommsEvents from './Comms/IPCCommsEvents'
/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron')
const validChannels = [
  IpcCommsEvents.saveFile,
  IpcCommsEvents.openFile,
  IpcCommsEvents.newCampaign,
  IpcCommsEvents.saveCampaignToFile,
  IpcCommsEvents.saveCurrentFile,
  IpcCommsEvents.openCampaignFromObject
]
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
window.electron = {
  send: (channel, data) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    } else {
      console.log(`${channel} is not a recognised channel`)
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    } else {
      console.log(`${channel} is not a recognised channel`)
    }
  }
}
