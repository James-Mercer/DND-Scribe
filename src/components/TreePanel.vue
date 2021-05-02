<template>
  <div>
    <v-toolbar dense>
      <v-text-field prepend-icon="mdi-magnify" hide-detail single-line clearable></v-text-field>
    </v-toolbar>
    <v-treeview hoverable dense
    open-on-click
    return-object
    :items="tree">
      <template v-slot:label="{ item }">
        <v-list-item @click="openItem(item)" @contextmenu="show"
        :id="item.id"
        :type="item.type">
        {{item.name}}
        </v-list-item>
      </template>
    </v-treeview>
    <v-menu dense
    v-model="contextMenuData.show"
    :position-x="contextMenuData.x"
    :position-y="contextMenuData.y"
    absolute
    offset-y >
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

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import { mapState } from 'vuex'
import Campaign from '@/types/Campaign'
import TreeGroup from '@/types/TreeGroup'
import Session from '@/types/Session'
import PlayerCharacter from '@/types/PlayerCharacter'
import NonPlayerCharacter from '@/types/NonPlayerCharacter'
import Location from '@/types/Location'
import ScribeObject from '@/types/ScribeObject'
import { watch } from 'original-fs'
import ReactiveMap from '@/types/ReactiveMap'

const someModule = namespace('AppModule/')

@Component
export default class TreePanel extends Vue {
  tree: Array<TreeGroup> = []
  selection: Array<any> = []

  contextMenuData: any = {
    x: 0,
    y: 0,
    show: false,
    targetId: 0,
    type: ''
  }

  @Mutation('addTab') addTab!: (id: string, focus: boolean) => void
  @Mutation('removeObject') removeObject!: (id: string) => void
  @Mutation('removeTabById') removeTabById!: (id: string) => void
  @Mutation('setTitle') setTitle!: (title: string) => void
  @Getter('getTitle') getTitle !: string
  @Getter('getObjects') getObjects!: ReactiveMap

  mounted () { console.log('TreePanel Mounted') }
  @Watch('getObjects', { immediate: true, deep: true })
  objectsChanged (val: any): void {
    console.log('object changed')
    const objects: ReactiveMap = this.getObjects
    console.log(objects)
    const newTree: Array<TreeGroup> = []
    const sessionTreeGroup = new TreeGroup('0', 'Sessions')
    const pcTreeGroup = new TreeGroup('1', 'Player Characters')
    const npcTreeGroup = new TreeGroup('2', 'Non-Player Characters')
    const locationTreeGroup = new TreeGroup('3', 'Locations')

    objects.forEach((obj: ScribeObject) => {
      console.log(`for each on ${obj.id}`)
      switch (obj.type) {
        case Session.typeName:
          sessionTreeGroup.children.push(obj)
          break
        case PlayerCharacter.typeName:
          pcTreeGroup.children.push(obj)
          break
        case NonPlayerCharacter.typeName:
          npcTreeGroup.children.push(obj)
          break
        case Location.typeName:
          locationTreeGroup.children.push(obj)
          break
        default:
          break
      }
    })
    console.log()
    newTree.push(sessionTreeGroup)
    newTree.push(pcTreeGroup)
    newTree.push(npcTreeGroup)
    newTree.push(locationTreeGroup)
    this.tree = newTree
  }

  get menuItems (): Array<string> {
    if (this.contextMenuData.type === TreeGroup.typeName) {
      return [] // ['new item']
    } else {
      return ['open', 'delete']
    }
  }

  openItem (item: ScribeObject): void {
    if (item.type !== 'TreeGroup') {
      this.addTab(item.id, true)
    }
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
    if (command === 'open') {
      this.addTab(this.contextMenuData.targetId, true)
    } else if (command === 'delete') {
      this.removeObject(this.contextMenuData.targetId)
      this.removeTabById(this.contextMenuData.targetId)
    } else if (command === 'new item') {
      // create a new item
    }
  }
}
</script>

<style scoped>
</style>
