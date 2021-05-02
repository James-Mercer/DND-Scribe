<template>
  <div>
    <v-tabs
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      show-arrows
      v-model="currentOpenTabIndex">
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="tab in getTabs" :key="tab" @contextmenu="showContextMenu">
        {{ getTabTitle(tab) }}
        <v-btn x-small @click="closeTab(key)"> x </v-btn>
        </v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentOpenTabIndex">
      <v-tab-item v-for="t in getTabs" :key="t">
        <SessionEditor v-if="getTabObjectType === 'session'"/>
        <PCEditor v-else-if="getTabObjectType === 'PC'"/>
        <NPCEditor v-else-if="getTabObjectType === 'NPC'"/>
      </v-tab-item>
    </v-tabs-items>

    <v-menu dense
      v-model="promptVisible"
      :position-x="promptX"
      :position-y="promptY"
      absolute offset-y >
      <v-list>
        <v-list-item dense v-for="menuItem in menuItems" :key="menuItem" @click="clickAction(menuItem)">
          <v-list-item-content>
            <v-list-item-title>{{menuItem}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import SessionEditor from './SessionEditor.vue'
import PCEditor from './PCEditor.vue'
import NPCEditor from './NPCEditor.vue'
import ScribeObject from '@/types/ScribeObject'
import Campaign from '@/types/Campaign'
import PromptData from '@/types/PopupPromptData'

@Component({
  components: {
    SessionEditor,
    PCEditor,
    NPCEditor
  }
})
export default class EditorContainer extends Vue {
  contextMenuData: PromptData = new PromptData()
  menuItems: Array<string> = ['Close all but this', 'Close all']

  @Getter('getOpenTabs') getTabs!: Array<string>
  @Getter('getTabIndex') getCurrentTabIndex!: number
  @Action('findObject') findObject!: (id: string) => ScribeObject | undefined
  @Action('setCurrentTabIndex') setCurrentTabIndex!: (index: number) => void
  @Action('removeTab') removeTab!: (index: number) => void

  get currentOpenTabIndex (): number { return this.getCurrentTabIndex }
  set currentOpenTabIndex (newVal: number) { this.setCurrentTabIndex(newVal) }

  getTabTitle (id: string): string {
    const obj: ScribeObject | undefined = this.findObject(id)
    return obj ? obj.name : 'Unknown Object'
  }

  get getTabObjectType (): string {
    const id: string = this.getTabs[this.currentOpenTabIndex]
    const obj: ScribeObject | undefined = this.findObject(id)
    return obj ? obj.type : ScribeObject.typeName
  }

  get promptX (): number { return this.contextMenuData.getX() }
  get promptY (): number { return this.contextMenuData.getY() }
  get promptVisible (): boolean { return this.contextMenuData.getVisible() }
  set promptVisible (newVal: boolean) { this.contextMenuData.setVisible(newVal) }

  closeTab (key: string): void {
    if (this.currentOpenTabIndex > -1) {
      this.removeTab(this.currentOpenTabIndex)
    }
  }

  showContextMenu (e: any): void {
    e.preventDefault()
    const target = e.target || e.srcElement
    this.contextMenuData.setVisible(false)
    this.contextMenuData.setPosition(e.clientX, e.clientY)
    // this.contextMenuData.targetId = target.getAttribute('id')
    // this.contextMenuData.type = target.getAttribute('type')
    this.$nextTick(() => {
      this.contextMenuData.setVisible(true)
    })
  }

  clickAction (command: string) {
    // to be implemented
    console.log(`${command} has yet to be implemented`)
  }
}
</script>
