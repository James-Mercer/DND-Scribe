<template>
  <v-sheet>
    <v-treeview
      elevation="0"
      hoverable
      dense
      open-on-click
      return-object
      :items="tree"
    >
      <template v-slot:label="{ item }">
        <v-list-item
          @click="openItem(item)"
          @contextmenu="show"
          :id="item.id"
          :type="item.type"
        >
          {{ item.name }}
        </v-list-item>
      </template>
    </v-treeview>
    <v-menu
      dense
      v-model="contextMenuData.show"
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
            {{ menuItem }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Mutation, namespace } from 'vuex-class'

import { PayloadAddTab } from '@/store/StoreInterfaces'

import ScribeObject from '@/types/ScribeObject'
import TreeGroup from '@/types/TreeGroup'
import Session from '@/types/Session'
import Character from '@/types/Character'
import Location from '@/types/Location'
import Organisation from '@/types/Organisation'
import Artifact from '@/types/Artifact'
import ReactiveMap from '@/types/ReactiveMap'
import { sessionTypeName, typeNames } from '@/types/typeUtils'

const someModule = namespace('AppModule/')

@Component
export default class TreePanel extends Vue {
  static Events = {
    openInGraph: 'open-in-graph',
    openInTimeline: 'open-in-timeline',
    newItem: 'new-item'
  }

  tree: Array<TreeGroup> = []
  selection: Array<any> = []

  contextMenuData: {
    x: number;
    y: number;
    show: boolean;
    targetId: string | number;
    type: string;
  } = {
    x: 0,
    y: 0,
    show: false,
    targetId: 0,
    type: ''
  }

  @State view!: number
  @State title!: string
  @State objects!: ReactiveMap
  @Mutation setView!: (viewNum: number) => void
  @Mutation('addTab') addTab!: (payload: PayloadAddTab) => void
  @Mutation('removeObject') removeObject!: (id: string) => void
  @Mutation('removeTabById') removeTabById!: (id: string) => void
  @Mutation('setTitle') setTitle!: (title: string) => void

  get campaignTitle (): string {
    return this.title
  }

  set campaignTitle (title: string) {
    this.setTitle(title)
  }

  @Watch('objects', { immediate: true, deep: false })
  objectsChanged (val: any): void {
    const newTree: Array<TreeGroup> = []
    const sessionTreeGroup = new TreeGroup('0', 'Sessions')
    const characterTreeGroup = new TreeGroup('1', 'Characters')
    const locationTreeGroup = new TreeGroup('2', 'Locations')
    const OrganisationTreeGroup = new TreeGroup('3', 'Organisations')
    const ArtifactTreeGroup = new TreeGroup('4', 'Artifacts')

    this.objects.forEach((obj: ScribeObject) => {
      switch (obj.type) {
        case Session.typeName:
          sessionTreeGroup.children.push(obj)
          break
        case Character.typeName:
          characterTreeGroup.children.push(obj)
          break
        case Location.typeName:
          locationTreeGroup.children.push(obj)
          break
        case Organisation.typeName:
          OrganisationTreeGroup.children.push(obj)
          break
        case Artifact.typeName:
          ArtifactTreeGroup.children.push(obj)
          break
        default:
          break
      }
    })
    newTree.push(sessionTreeGroup)
    newTree.push(characterTreeGroup)
    newTree.push(locationTreeGroup)
    newTree.push(OrganisationTreeGroup)
    newTree.push(ArtifactTreeGroup)
    this.tree = newTree
  }

  get menuItems (): Array<string> {
    if (this.contextMenuData.type === TreeGroup.typeName) {
      return ['new item']
    } else {
      return [
        'Open',
        'Open in editor',
        'Show on Graph',
        'Show on Timeline',
        'Delete'
      ]
    }
  }

  openItem (item: ScribeObject): void {
    if (item.type !== TreeGroup.typeName) {
      if (this.view === 0) {
        this.openItemEditor(item)
      }
      if (this.view === 1) {
        this.openItemGraph(item)
      }
      if (this.view === 2) {
        this.openItemTimeline(item)
      }
    }
  }

  openItemEditor (item: ScribeObject) {
    const payload: PayloadAddTab = { id: item.id, focus: true }
    this.addTab(payload)
  }

  openItemGraph (item: ScribeObject) {
    this.$emit(TreePanel.Events.openInGraph, item)
  }

  openItemTimeline (item: ScribeObject) {
    this.$emit(TreePanel.Events.openInTimeline, item)
  }

  show (e: any) {
    e.preventDefault()
    const target = e.target || e.srcElement
    this.contextMenuData.show = false
    this.contextMenuData.x = e.clientX
    this.contextMenuData.y = e.clientY
    this.contextMenuData.targetId = target.getAttribute('id')
    this.contextMenuData.type = target.getAttribute('type')
    this.$nextTick(() => {
      this.contextMenuData.show = true
    })
  }

  clickAction (command: string) {
    console.log(command)
    if (this.contextMenuData.type !== TreeGroup.typeName) {
      const obj = this.objects.get(this.contextMenuData.targetId.toString())
      if (obj === undefined) {
        return
      }
      switch (command) {
        case this.menuItems[0]:
          switch (this.view) {
            case 0:
              this.openItemEditor(obj)
              break
            case 1:
              this.openItemGraph(obj)
              break
            case 2:
              this.openItemTimeline(obj)
              break
          }
          break
        case this.menuItems[1]:
          this.setView(0)
          this.openItemEditor(obj)
          break
        case this.menuItems[2]:
          this.setView(1)
          this.openItemGraph(obj)
          break
        case this.menuItems[3]:
          this.setView(2)
          this.openItemTimeline(obj)
          break
        case this.menuItems[4]:
          this.removeTabById(this.contextMenuData.targetId.toString())
          this.removeObject(this.contextMenuData.targetId.toString())
          break
      }
    } else if (this.contextMenuData.type === TreeGroup.typeName) {
      if (command === this.menuItems[0]) {
        const index: number =
          parseInt(this.contextMenuData.targetId.toString()) + 1
        const type = typeNames[index]
        this.$emit(TreePanel.Events.newItem, type)
      }
    }
  }
}
</script>

<style scoped></style>
