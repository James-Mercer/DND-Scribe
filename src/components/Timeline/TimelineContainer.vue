<template>
  <v-sheet class="full-height">
    <TimelineToolbar
      ref="toolbar"
      :config.sync="toolbarTypeFilter"
      :show-advanced="showAdvancedConfig"
      :timeline-items="itemsForToolbar"
      @go-to="goToScribeTlItem"
      @filter-changed="filterChanged"
      @show-advanced="toggleAdvancedConfig"
    ></TimelineToolbar>
    <div id="timeline-container" ref="timeline"></div>
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item dense>
          <v-list-item-content @click="openInEditor">
            Open in Editor
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openInGraph">
          <v-list-item-content>
            Open in graph
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-navigation-drawer
      id="config-aside"
      v-model="showAdvancedConfig"
      right
      absolute
      :app="false"
      width="400"
    >
      <TimelineConfigPanel
        :config.sync="timelineOptions"
        :styles.sync="groupStyles"
      ></TimelineConfigPanel>
    </v-navigation-drawer>
    <component :is="'style'">
      {{ getStyles() }}
    </component>
    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout"
      >{{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
import { TimelineFilters, TimelineData } from '@/store/StoreInterfaces'
import Session from '@/types/Session'
import {
  scribeTypeName,
  sessionTypeName,
  characterTypeName,
  locationTypeName,
  organisationTypeName,
  artifactTypeName,
  typeNames,
  ScribeTypeName
} from '@/types/typeUtils'
import TimelineToolbar from './TimelineToolbar.vue'
import TimelineConfigPanel from './TimelineConfigPanel.vue'
import { GroupStyles, ScribeTimelineItem } from '@/types/TimelineOptions'

import { DataSet } from 'vis-data/peer'
import {
  Timeline,
  TimelineOptions,
  TimelineGroup,
  TimelineEventPropertiesResult
} from 'vis-timeline/peer'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import ReactiveMap from '@/types/ReactiveMap'
import { IdType } from 'vis-network/peer'

@Component({
  components: { TimelineToolbar, TimelineConfigPanel }
})
export default class TimelineContainer extends Vue {
  timeline: Timeline | undefined
  items: DataSet<ScribeTimelineItem> = new DataSet<ScribeTimelineItem>()
  groups: Array<TimelineGroup> = []
  showAdvancedConfig = false
  toolbarTypeFilter: Array<string> = [
    'character',
    'location',
    'organisation',
    'artifact'
  ]

  $refs!: {
    timeline: HTMLElement;
    toolbar: TimelineToolbar;
  }

  loaded = false
  snackbar = {
    visible: false,
    message: '',
    timeout: 2000
  }

  contextMenu: {
    show: boolean;
    itemID: IdType | null;
    x: number;
    y: number;
  } = {
    show: false,
    itemID: null,
    x: 0,
    y: 0
  }

  @State objects!: ReactiveMap
  @State timelineOptions!: TimelineOptions
  @Mutation setTimelineOptions!: (config: TimelineOptions) => void
  @State timelineGroupStyles!: GroupStyles
  @Mutation setTimelineGroupStyles!: (styles: GroupStyles) => void
  @Action getTimelineItems!: (filters: TimelineFilters) => Promise<TimelineData>

  get groupStyles () {
    return this.timelineGroupStyles
  }

  set groupStyles (newStyle: GroupStyles) {
    console.log('setting styles')
    this.setTimelineGroupStyles(newStyle)
  }

  mounted () {
    this.refreshData()
    this.timeline = new Timeline(
      this.$refs.timeline,
      this.items,
      this.groups,
      this.timelineOptions
    )
    this.timeline.on('contextmenu', this.onContextClick)
  }

  @Watch('objects')
  refreshData (): void {
    console.log('Refreshing timeline data')
    this.getTimelineItems({
      filterSessionFn: this.filterSessions,
      filterLinkFn: this.filterLinks
    })
      .then((data: TimelineData) => {
        this.items = data.items
        this.groups = data.groups
        console.log(this.items)
        if (this.timeline) {
          this.timeline.setData({
            items: this.items,
            groups: this.groups
          })
        }
        this.loaded = true
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  get itemsForToolbar (): Array<ScribeTimelineItem> {
    return this.items.get()
  }

  filterSessions (obj: Session): boolean {
    return true
  }

  filterLinks (link: ScribeLink): boolean {
    const obj = this.objects.get(link.to)
    if (!obj) {
      console.log('no obj')
      return false
    }
    const include = this.toolbarTypeFilter.includes(obj.type)
    console.log(include)
    return include
  }

  toggleAdvancedConfig () {
    this.showAdvancedConfig = !this.showAdvancedConfig
  }

  goToScribeItem (item: ScribeObject, attempt = 0): void {
    if (this.timeline && this.loaded) {
      this.$refs.toolbar.setSelection(item)
    } else if (attempt < 5) {
      this.$nextTick(() => {
        this.goToScribeItem(item, attempt++)
      })
    }
  }

  goToScribeTlItem (item: ScribeTimelineItem, attempt = 0): void {
    console.log(item)
    if (this.timeline && this.loaded) {
      const time: Date = new Date(item.start)
      this.timeline.setSelection(item.id)
      if (item.end) {
        time.setTime(
          time.getTime() + (time.getTime() - new Date(item.end).getTime()) / 2
        )
      }
      this.timeline.moveTo(item.start)
    } else if (attempt < 5) {
      console.log('timeline not yet loaded')
      this.$nextTick(() => {
        this.goToScribeTlItem(item, attempt)
      })
    }
  }

  filterChanged () {
    this.groups.forEach((group: TimelineGroup) => {
      if (group.id === sessionTypeName) {
        return
      }
      group.visible =
        group.title !== undefined &&
        this.toolbarTypeFilter.includes(group.title)
    })
    if (this.timeline) {
      this.timeline.setGroups(this.groups)
      this.refreshData()
    }
  }

  onContextClick (event: TimelineEventPropertiesResult) {
    console.log(event)
    this.contextMenu.itemID = event.item || null
    this.contextMenu.x = (event.event as MouseEvent).clientX
    this.contextMenu.y = (event.event as MouseEvent).clientY
    this.$nextTick(() => {
      this.contextMenu.show = true
    })
  }

  openInEditor () {
    if (this.contextMenu.itemID) {
      const obj = this.getScribeObj(this.contextMenu.itemID?.toString())
      if (obj) {
        this.$emit('open-in-editor', obj)
      }
    }
  }

  openInGraph () {
    if (this.contextMenu.itemID) {
      const obj = this.getScribeObj(this.contextMenu.itemID?.toString())
      if (obj) {
        this.$emit('open-in-graph', obj)
      }
    }
  }

  getScribeObj (id: IdType): ScribeObject | null {
    const item = this.items.get(id)
    if (item === null) {
      return null
    }
    return (
      this.objects.get(
        item.isLink && item.linkTo ? item.linkTo.id : item.id.toString()
      ) || null
    )
  }

  @Watch('timelineOptions', { deep: true })
  configChanged (v: TimelineOptions) {
    console.log('timeline config changed')
    this.setTimelineOptions(v)
    if (this.timeline) {
      this.timeline.setOptions(v)
    }
  }

  @Watch('groupStyles', { deep: true })
  stylesChanged (v: GroupStyles) {
    console.log('timeline group styles changed')
    this.setTimelineGroupStyles(v)
  }

  getStyles (): string {
    return `.vis-group-${sessionTypeName} .vis-item {
      background-color: ${this.groupStyles.session.backgroundColor};
      color: ${this.groupStyles.session.fontColor};
      font-family: ${this.groupStyles.session.fontFace};
      font-size: ${this.groupStyles.session.fontSize};
      border-width: ${this.groupStyles.session.borderWidth};
      border-radius: ${this.groupStyles.session.borderRadius};
    }
    .vis-group-${characterTypeName} .vis-item {
      background-color: ${this.groupStyles.character.backgroundColor};
      color: ${this.groupStyles.character.fontColor};
      font-family: ${this.groupStyles.character.fontFace};
      font-size: ${this.groupStyles.character.fontSize};
      border-width: ${this.groupStyles.character.borderWidth};
      border-radius: ${this.groupStyles.character.borderRadius};
    }
    .vis-group-${locationTypeName} .vis-item {
      background-color: ${this.groupStyles.location.backgroundColor};
      color: ${this.groupStyles.location.fontColor};
      font-family: ${this.groupStyles.location.fontFace};
      font-size: ${this.groupStyles.location.fontSize};
      border-width: ${this.groupStyles.location.borderWidth};
      border-radius: ${this.groupStyles.location.borderRadius};
    }
    .vis-group-${organisationTypeName} .vis-item {
      background-color: ${this.groupStyles.organisation.backgroundColor};
      color: ${this.groupStyles.organisation.fontColor};
      font-family: ${this.groupStyles.organisation.fontFace};
      font-size: ${this.groupStyles.organisation.fontSize};
      border-width: ${this.groupStyles.organisation.borderWidth};
      border-radius: ${this.groupStyles.organisation.borderRadius};
    }
    .vis-group-${artifactTypeName} .vis-item {
      background-color: ${this.groupStyles.artifact.backgroundColor};
      color: ${this.groupStyles.artifact.fontColor};
      font-family: ${this.groupStyles.artifact.fontFace};
      font-size: ${this.groupStyles.artifact.fontSize};
      border-width: ${this.groupStyles.artifact.borderWidth};
      border-radius: ${this.groupStyles.artifact.borderRadius};
    }`
  }
}
</script>

<style scoped>
.full-height {
  height: 100% !important;
}
#timeline-container {
  position: absolute !important;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
}
#config-aside {
  top: 48px !important;
  height: calc(100% - 48px) !important;
}
</style>
