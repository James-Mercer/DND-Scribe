<template>
  <v-app>
    <v-app-bar app clipped-left flat>
      <v-btn @click="toggleCreateDialog">
        New Document
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="viewMode">
        <v-btn> <v-icon>mdi-file-document-edit</v-icon> Editor </v-btn>
        <v-btn> <v-icon>mdi-graph</v-icon>Graph </v-btn>
        <v-btn> <v-icon>mdi-timeline</v-icon>Timeline </v-btn>
      </v-btn-toggle>
    </v-app-bar>
    <v-main app>
      <v-navigation-drawer id="nav-bar" app clipped permanent>
        <v-container id="container">
          <v-row class="pa-0">
            <v-col>
              <v-text-field
                v-model="campaignTitle"
                filled
                dense
                label="Campaign Title"
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0">
              <TreePanel
                ref="treePanel"
                @new-item="createItemOfType"
                @open-in-graph="openInGraph"
                @open-in-timeline="openInTimeline"
              ></TreePanel>
            </v-col>
          </v-row>
        </v-container>
        <v-toolbar dense clipped absolute floating bottom>
          <v-text-field
            prepend-icon="mdi-magnify"
            hide-detail
            single-line
            clearable
          >
          </v-text-field>
          <v-divider></v-divider>
          <v-menu top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon
                ><v-icon>mdi-sort</v-icon></v-btn
              >
            </template>
            <v-list v-for="item in sortList" :key="item.label">
              <v-list-item dense>
                <v-list-item-icon>{{ item.icon }}</v-list-item-icon>
                <v-list-item-content>{{ item.label }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-navigation-drawer>
      <EditorContainer
        ref="editorContainer"
        v-if="viewMode === 0"
      ></EditorContainer>
      <GraphContainer
        ref="graphContainer"
        v-else-if="viewMode === 1"
        @open-in-editor="openInEditor"
        @open-in-timeline="openInTimeline"
      ></GraphContainer>
      <TimelineContainer
        ref="timelineContainer"
        v-else-if="viewMode === 2"
        @open-in-editor="openInEditor"
        @open-in-graph="openInGraph"
      ></TimelineContainer>
      <v-dialog v-model="showCreateDialog" max-width="600px">
        <v-card>
          <v-card-title>Create New Document</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="newItem.name"
                    label="Name"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="newItem.type"
                    label="Type"
                    :items="typeNames"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="toggleCreateDialog"> Cancel </v-btn>
            <v-btn color="primary" :disabled="!canCreate" @click="createItem">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'

import TreePanel from '@/components/TreePanel.vue'
import EditorContainer from '@/components/EditorContainer.vue'
import GraphContainer from '@/components/Graph/GraphContainer.vue'
import TimelineContainer from '@/components/Timeline/TimelineContainer.vue'

import ScribeObject from '@/types/ScribeObject'
import Session from '@/types/Session'
import Character from '@/types/Character'
import Location from '@/types/Location'

import {
  typeNames,
  typeIcons,
  ScribeTypeName,
  sessionTypeName,
  characterTypeName,
  locationTypeName,
  organisationTypeName,
  artifactTypeName
} from '@/types/typeUtils'
import Artifact from '@/types/Artifact'
import Organisation from '@/types/Organisation'

interface SortMenuItem {
  label: string;
  icon: string;
}

const typedSort: SortMenuItem = { label: 'Typed', icon: 'mdi-sort' }
const alphabetical: SortMenuItem = { label: 'Alphabetical', icon: 'mdi-sort' }
const reverseAlphabetical: SortMenuItem = {
  label: 'Reverse Alpha',
  icon: 'mdi-sort'
}

@Component({
  components: {
    TreePanel,
    EditorContainer,
    GraphContainer,
    TimelineContainer
  }
})
export default class CampaignView extends Vue {
  sortList: Array<SortMenuItem> = []
  sortMode: 0 | 1 = 0
  treeMode: 0 | 1 = 0
  showCreateDialog = false

  newItem: { name: string; type: string } = {
    name: '',
    type: ''
  }

  get typeNames () {
    return typeNames.slice(1, typeNames.length)
  }

  $refs!: {
    treePanel: TreePanel;
    editorContainer: EditorContainer;
    graphContainer: GraphContainer;
    timelineContainer: TimelineContainer;
  }

  @State view!: number
  @Mutation setView!: (view: number) => void
  get viewMode () {
    return this.view
  }

  set viewMode (v: number) {
    this.setView(v)
  }

  @Mutation addObject!: (newObject: ScribeObject) => void

  @State title!: string
  @Mutation setTitle!: (title: string) => void
  get campaignTitle (): string {
    return this.title
  }

  set campaignTitle (title: string) {
    this.setTitle(title)
  }

  toggleCreateDialog () {
    this.showCreateDialog = !this.showCreateDialog
    if (!this.showCreateDialog) {
      this.newItem = { name: '', type: '' }
    }
  }

  iconForType (typeNumber: number): string {
    const type: ScribeTypeName = typeNames[typeNumber]
    return typeIcons[type]
  }

  get canCreate () {
    return !!this.newItem.name && !!this.newItem.type
  }

  createItem (): void {
    switch (this.newItem.type) {
      case sessionTypeName: {
        const newSession: Session = new Session(this.newItem.name)
        this.addObject(newSession)
        break
      }
      case characterTypeName: {
        const newPC: Character = new Character(this.newItem.name)
        this.addObject(newPC)
        break
      }
      case locationTypeName: {
        const newLocation = new Location(this.newItem.name)
        this.addObject(newLocation)
        break
      }
      case organisationTypeName: {
        const newOrganisation = new Organisation(this.newItem.name)
        this.addObject(newOrganisation)
        break
      }
      case artifactTypeName: {
        const newArtifact = new Artifact(this.newItem.name)
        this.addObject(newArtifact)
        break
      }
    }
    this.showCreateDialog = false
    this.newItem = { name: '', type: '' }
  }

  createItemOfType (type: ScribeTypeName) {
    this.newItem.type = type
    this.showCreateDialog = true
  }

  toggleSortMode (mode: 0 | 1) {
    this.sortMode = mode
  }

  toggleTreeMode () {
    this.treeMode = this.treeMode === 0 ? 1 : 0
  }

  openInEditor (item: ScribeObject) {
    if (this.view !== 0) {
      this.setView(0)
    }
    this.$nextTick(() => {
      this.$refs.treePanel.openItemEditor(item)
    })
  }

  openInGraph (item: ScribeObject) {
    console.log('catch open in graph')
    if (this.view !== 1) {
      this.setView(1)
    }
    this.$nextTick(() => {
      this.$refs.graphContainer.goToItem(item)
    })
  }

  openInTimeline (item: ScribeObject) {
    console.log('Go to timeline')
    if (this.view !== 2) {
      this.setView(2)
    }
    this.$nextTick(() => {
      this.$refs.timelineContainer.goToScribeItem(item)
    })
  }
}
</script>

<style>
.v-toolbar__content {
  width: 100%;
}
</style>
<style scoped>
#container {
  padding: 0 0 48px 0;
}
</style>
