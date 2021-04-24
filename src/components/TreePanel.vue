<template>
  <div>
    <v-toolbar dense>
      <v-text-field prepend-icon="mdi-magnify" hide-detail single-line clearable></v-text-field>
    </v-toolbar>
    <v-treeview hoverable dense
    open-on-click
    return-object
    :items="items">
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
import { Vue, Component } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ADD_TAB, REMOVE_TAB_BY_ID, GET_CAMPAIGN, REMOVE_OBJECT } from '@/store/operation-types'
import Campaign from '@/types/Campaign'
import TreeGroup from '@/types/TreeGroup'
import Session from '@/types/Session'
import PlayerCharacter from '@/types/PlayerCharacter'
import NonPlayerCharacter from '@/types/NonPlayerCharacter'
import ScribeObject from '@/types/ScribeObject'

@Component({})
export default class TreePanel extends Vue {
  tree: any = {}
  selection: Array<any> = []

  contextMenuData: any = {
    x: 0,
    y: 0,
    show: false,
    targetId: 0,
    type: ''
  }

  @Getter(GET_CAMPAIGN) campaign!: Campaign
  @Mutation(ADD_TAB) addTab!: (id: string, focus: boolean) => void
  @Mutation(REMOVE_TAB_BY_ID) removeTabById!: (id: string) => void
  @Mutation(REMOVE_OBJECT) removeObject!: (id: string) => boolean

  get items (): Array<TreeGroup> {
    const camp: Campaign = this.campaign
    console.log(camp)

    const items: Array<TreeGroup> = []
    const sessionGroup = new TreeGroup('1', Session.typeName + 's')
    sessionGroup.children = camp.sessions
    items.push(sessionGroup)
    const pcGroup = new TreeGroup('2', PlayerCharacter.typeName + 's')
    pcGroup.children = camp.playerCharacters
    items.push(pcGroup)
    const npcGroup = new TreeGroup('3', NonPlayerCharacter.typeName + 's')
    npcGroup.children = camp.nonPlayerCharacters
    items.push(npcGroup)
    return items
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
