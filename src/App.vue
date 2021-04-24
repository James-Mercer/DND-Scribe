<template>
    <router-view/>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { IpcRendererEvent } from 'electron'
import IpcCommsEvents from './Comms/IPCCommsEvents'

interface ElectronAPI {
  send: (channel: string, data: any[]) => void;
  receive: (channel: string, func: (ev: IpcRendererEvent, args: any[]) => void) => void;
}

interface ElectronBrowserWindow extends Window {
  electron: ElectronAPI;
}

@Component({})
export default class App extends Vue {
  mounted () {
    const electronBrowserWindow: ElectronBrowserWindow = window as Window as ElectronBrowserWindow
    // electronBrowserWindow.electron.receive(IpcCommsEvents.)
  }
}
</script>
