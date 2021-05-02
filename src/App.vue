<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { IpcRendererEvent } from 'electron'
import IpcCommsEvents from './Comms/IPCCommsEvents'
import Campaign from '@/types/Campaign'

interface ElectronAPI {
  send: (channel: string, data: any[]) => void;
  receive: (
    channel: string,
    func: (ev: IpcRendererEvent, args: any[]) => void
  ) => void;
}

interface ElectronBrowserWindow extends Window {
  electron: ElectronAPI;
}

@Component({})
export default class App extends Vue {
  @Action('newCampaign') createNewCampaign!: (title: string, path?: string) => boolean

  mounted () {
    const electronBrowserWindow: ElectronBrowserWindow = window as unknown as ElectronBrowserWindow
    if (electronBrowserWindow.electron) {
      console.log('IPC comms regesting handlers')
      electronBrowserWindow.electron.receive(IpcCommsEvents.newCampaign, this.newCampaign)
      electronBrowserWindow.electron.receive(IpcCommsEvents.saveCampaignToFile, this.saveCampaignToFile)
      electronBrowserWindow.electron.receive(IpcCommsEvents.openCampaignFromObject, this.openCampaignFromObject)
      electronBrowserWindow.electron.receive(IpcCommsEvents.saveCurrentFile, this.saveCurrentCampaign)
    }
  }

  newCampaign (ev: IpcRendererEvent, args: any[]) {
    console.log('App - new campaign')
    console.log(ev)
    console.log(args)
    this.createNewCampaign('', '')
  }

  saveCampaignToFile (ev: IpcRendererEvent, args: any[]) {
    console.log('App - save campaign to file')
    console.log(ev)
    console.log(args)
    if ((window as any).electron) {
    }
  }

  saveCurrentCampaign (ev: IpcRendererEvent, args: any[]): void {
    console.log('App - save current campaign')
    console.log(ev)
    console.log(args)
  }

  openCampaignFromObject (ev: IpcRendererEvent, args: any[]) {
    console.log('App - open campaign using object')
    console.log(ev)
    console.log(args)
  }
}
</script>
