<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'
import IpcCommsEvents from './ThreadComms/IPCCommsEvents'
import {
  PersistantState,
  PayloadLoad,
  PayloadNewCampaign
} from './store/StoreInterfaces'

interface ElectronAPI {
  send: (channel: string, data: any[]) => void;
  receive: (channel: string, func: (args: any[], arg?: any[]) => void) => void;
}

interface ElectronBrowserWindow extends Window {
  electron: ElectronAPI;
}

@Component({})
export default class App extends Vue {
  @State filePath!: string | undefined
  @Getter('getStateToSave') getStateToSave!: PersistantState
  @Mutation('setFilePath') setFilePath!: (path: string) => void
  @Mutation('newCampaign') newCampaign!: (payload: PayloadNewCampaign) => {}
  @Mutation('loadCampaign') loadCampaign!: (payload: PayloadLoad) => void

  createNewCampaign (title?: any, path?: any): void {
    console.log('App - new campaign')
    console.log(title)
    console.log(path)
    this.newCampaign({ title, path })
  }

  saveCampaignToFile (path: any[]): void {
    console.log('App - save campaign to file')
    console.log('path')
    console.log(path)
    const electronWindow: ElectronBrowserWindow = (window as unknown) as ElectronBrowserWindow
    if (!electronWindow.electron) {
      console.log('Electron API unavailable')
      alert('Internal thread comm error')
    }
    console.log('save state object')
    console.log(this.getStateToSave)
    electronWindow.electron.send(IpcCommsEvents.saveFile, [
      path,
      JSON.stringify(this.getStateToSave)
    ])
  }

  saveCurrentCampaign (args: any[]): void {
    console.log('App - save current campaign')
    console.log(args)
    const electronWindow: ElectronBrowserWindow = (window as unknown) as ElectronBrowserWindow
    if (!electronWindow.electron) {
      console.log('Electron API unavailable')
      alert('Internal thread comm error')
    }
    if (this.filePath !== undefined && this.filePath.length > 0) {
      console.log('filepath exists save to it')
      electronWindow.electron.send(IpcCommsEvents.saveFile, [
        this.filePath,
        JSON.stringify(this.getStateToSave)
      ])
    } else {
      console.log('no filepath make the user select one')
      electronWindow.electron.send(IpcCommsEvents.pickAndSaveFile, [
        JSON.stringify(this.getStateToSave)
      ])
    }
  }

  openCampaignFromObject (path: any, campaign?: any): void {
    console.log('App - open campaign using object')
    const hasTitle: boolean = campaign ? campaign?.title !== undefined : false
    const hasObjects: boolean = campaign
      ? campaign?.objects !== undefined
      : false
    const hasOpenTabs: boolean = campaign
      ? campaign?.openTabs !== undefined
      : false
    const hasTabIndex: boolean = campaign
      ? campaign?.tabIndex !== undefined
      : false

    if (!hasTitle || !hasObjects || !hasOpenTabs || !hasTabIndex) {
      ;((window as unknown) as ElectronBrowserWindow).electron.send(
        IpcCommsEvents.showError,
        [Error('Malformed Campaign file')]
      )
      console.log(campaign)
      return
    }
    const payload: PayloadLoad = {
      path: path as string,
      toLoad: campaign as PersistantState
    }
    this.loadCampaign(payload)
  }

  mounted () {
    const electronBrowserWindow: ElectronBrowserWindow = (window as unknown) as ElectronBrowserWindow
    if (electronBrowserWindow.electron) {
      console.log('IPC comms registering handlers')
      electronBrowserWindow.electron.receive(
        IpcCommsEvents.newCampaign,
        this.createNewCampaign
      )
      electronBrowserWindow.electron.receive(
        IpcCommsEvents.saveCampaignToFile,
        this.saveCampaignToFile
      )
      electronBrowserWindow.electron.receive(
        IpcCommsEvents.openCampaignFromObject,
        this.openCampaignFromObject
      )
      electronBrowserWindow.electron.receive(
        IpcCommsEvents.saveCurrentFile,
        this.saveCurrentCampaign
      )
      electronBrowserWindow.electron.receive(
        IpcCommsEvents.updateFilePath,
        (args: any[]) => {
          console.log(args)
          this.setFilePath(args.toString())
        }
      )
    }
  }
}
</script>

<style scoped>
router-view {
  height: 100%;
}
</style>

<style>
html {
  width: 100vw;
  height: 100vh;
}
</style>
