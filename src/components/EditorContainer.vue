<template>
  <div id="tabbed-editor" class="pa-0">
    <v-tabs
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      show-arrows
      v-model="openTabIndex"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        v-for="(tab, index) in openTabs"
        :key="tab"
        @contextmenu="showContextMenu"
      >
        {{ getTabTitle(index) }}
        <v-btn x-small @click="closeTab(index)"> x </v-btn>
      </v-tab>
    </v-tabs>

    <v-tabs-items id="tab-items" v-model="openTabIndex">
      <v-tab-item v-for="tabId in openTabs" :key="tabId">
        <session-editor v-if="isSession"></session-editor>
        <editor v-else></editor>
      </v-tab-item>
    </v-tabs-items>

    <v-menu
      dense
      v-model="contextMenuData.visible"
      :position-x="contextMenuData.x"
      :position-y="contextMenuData.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item
          dense
          v-for="menuItem in menuItems"
          :key="menuItem"
          @click="clickAction(menuItem)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ menuItem }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'

import ScribeObject from '@/types/ScribeObject'
import Session from '@/types/Session'

import Editor from './Editors/Editor.vue'
import SessionEditor from './Editors/SessionEditor.vue'

interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
  targetID: string;
  targetType: string;
}

@Component({
  components: {
    Editor,
    SessionEditor
  }
})
export default class EditorContainer extends Vue {
  contextMenuData: ContextMenu = {
    x: 0,
    y: 0,
    visible: false,
    targetID: '',
    targetType: ''
  }

  menuItems: Array<string> = ['Close all but this', 'Close all']

  @State openTabs!: Array<string>
  @State tabIndex!: number
  @Getter getCurrentTabObject!: ScribeObject | undefined
  @Getter getTabTitles!: Array<string>
  @Mutation setCurrentTabIndex!: (index: number) => void
  @Mutation removeTabByIndex!: (index: number) => void

  get isSession () {
    return this.getCurrentTabObject
      ? this.getCurrentTabObject.type === Session.typeName
      : false
  }

  get openTabIndex (): number {
    return this.tabIndex
  }

  set openTabIndex (newVal: number) {
    this.setCurrentTabIndex(newVal)
  }

  getTabTitle (index: number): string {
    return this.getTabTitles[index]
  }

  get getTabObjectType (): string {
    return this.getCurrentTabObject
      ? this.getCurrentTabObject.type
      : ScribeObject.typeName
  }

  closeTab (index: number): void {
    this.removeTabByIndex(index)
  }

  showContextMenu (e: any): void {
    e.preventDefault()
    this.contextMenuData.visible = false
    this.contextMenuData.x = e.clientX
    this.contextMenuData.y = e.clientY
    // this.contextMenuData.targetId = target.getAttribute('id')
    // this.contextMenuData.type = target.getAttribute('type')
    this.$nextTick(() => {
      this.contextMenuData.visible = true
    })
  }

  clickAction (command: string) {
    // to be implemented
    console.log(`${command} has yet to be implemented`)
  }
}
</script>

<style scoped>
#tabbed-editor,
.v-window-item {
  height: 100%;
}

#tab-items {
  height: calc(100% - 48px);
  overflow: scroll;
}
</style>
