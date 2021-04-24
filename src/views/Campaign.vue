<template>
  <v-app>
    <v-app-bar app clipped-left flat>
      <v-btn @click="newItem(0)" ><v-icon>{{iconMap.SESSION}}</v-icon>Add session</v-btn>
      <v-btn @click="newItem(1)"><v-icon>{{iconMap.PC}}</v-icon> Add Player Character</v-btn>
      <v-btn @click="newItem(2)"><v-icon>{{iconMap.NPC}}</v-icon> Add NPC </v-btn>
      <v-btn @click="newItem(3)"><v-icon>{{iconMap.PLACE}}</v-icon></v-btn>
    </v-app-bar>
    <v-main app>
      <v-navigation-drawer app clipped permanent>
        <TreePanel></TreePanel>
      </v-navigation-drawer>
      <EditorContainer></EditorContainer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TreePanel from '@/components/TreePanel.vue'
import EditorContainer from '@/components/EditorContainer.vue'

import { ADD_OBJECT, GET_CAMPAIGN } from '@/store/operation-types'
import { iconMap } from '@/types/iconMap'
import Campaign from '@/types/Campaign'
import ScribeObject from '@/types/ScribeObject'
import Session from '@/types/Session'
import { Getter, Mutation } from 'vuex-class'
import PlayerCharacter from '@/types/PlayerCharacter'
import NonPlayerCharacter from '@/types/NonPlayerCharacter'

@Component({
  components: {
    TreePanel,
    EditorContainer
  }
})
export default class CampaignView extends Vue {
  iconMap: any = iconMap

  @Getter(GET_CAMPAIGN) getCampaign!: Campaign
  @Mutation(ADD_OBJECT) addObject!: (newObject: ScribeObject) => void

  newItem (type: number): void {
    console.log(type)
    switch (type) {
      case 0: {
        const newSession: Session = new Session('Test session')
        this.addObject(newSession)
        break
      }
      case 1: {
        console.log('make new player character')
        const newPC: PlayerCharacter = new PlayerCharacter('test character')
        this.addObject(newPC)
        break
      }
      case 2: {
        console.log('make new non player character')
        const newNPC: NonPlayerCharacter = new NonPlayerCharacter('Test NPC')
        this.addObject(newNPC)
        break
      }
    }
  }
}
</script>
