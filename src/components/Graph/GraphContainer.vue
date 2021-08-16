<template>
  <v-sheet class="full-height no-overflow" eager>
    <graphToolbar
      id="graph-toolbar"
      :data="toolbarData"
      :advanced.sync="showConfigPanel"
      @filter-changed="filterChanged"
      @selection-made="goToToolbarSelection"
      @fit="fit"
      @refresh="refresh"
    ></graphToolbar>
    <div id="graph-container" ref="graph"></div>
    <v-navigation-drawer
      id="config-aside"
      v-model="showConfigPanel"
      right
      absolute
      :app="false"
      width="400"
    >
      <graph-config-panel :config.sync="networkOptions"></graph-config-panel>
    </v-navigation-drawer>
    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout"
      >{{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-menu
      v-model="contextData.visible"
      absolute
      :position-x="contextData.x"
      :position-y="contextData.y"
      offset-y
    >
      <v-list>
        <v-list-item dense @click="openInEditor">
          <v-list-item-content>
            Open in Editor
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense @click="openInTimeline">
          <v-list-item-content>
            Open in Timeline
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'

import GraphToolbar, { GraphToolbarData } from './GraphToolbar.vue'
import GraphConfigPanel from './GraphConfigPanel.vue'

import ScribeObject, { ScribeLink } from '@/types/ScribeObject'
import ReactiveMap from '@/types/ReactiveMap'

import { DataSet } from 'vis-data/peer'
import {
  Network,
  Data,
  Node,
  Edge,
  Options,
  NetworkEvents
} from 'vis-network/peer'
import { GraphFilters, NodesAndEdges } from '@/store/StoreInterfaces'
import NetworkOptions from '@/types/NetworkOptions'

@Component({
  components: {
    GraphToolbar,
    GraphConfigPanel
  }
})
export default class GraphContainer extends Vue {
  // type dec refs
  $refs!: {
    graph: HTMLElement;
    configContainer: HTMLElement;
  }

  loaded = false

  graphNetwork: Network | undefined
  showConfigPanel = false
  nodes: DataSet<Node> = new DataSet<Node>()
  edges: DataSet<Edge> = new DataSet<Edge>()
  toolbarData: GraphToolbarData = new GraphToolbarData()

  contextData: {
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
  } = {
    visible: false,
    x: 0,
    y: 0,
    itemId: null
  }

  snackbar = {
    visible: false,
    message: '',
    timeout: 6000
  }

  @State objects!: ReactiveMap
  @State networkOptions!: NetworkOptions
  @Mutation setNetworkOptions!: (newOptions: NetworkOptions) => void

  @Action getNodesAndEdges!: (filters: GraphFilters) => Promise<NodesAndEdges>

  get graphData (): Data {
    this.getNodesAndEdges({
      nodesFilterFn: this.filterNodes,
      edgesFilterFn: this.filterEdges
    })
      .then((data: NodesAndEdges) => {
        this.nodes.clear()
        this.edges.clear()
        this.nodes.add(data.nodes)
        this.edges.add(data.edges)
        this.loaded = true
      })
      .catch()
    return { nodes: this.nodes, edges: this.edges }
  }

  mounted () {
    this.graphNetwork = new Network(
      this.$refs.graph,
      this.graphData,
      this.networkOptions as Options
    )
    this.refreshGraphData()
    // events listeners
    this.graphNetwork.on('click', this.graphClicked)
    this.graphNetwork.on('doubleClick', this.graphDoubleClicked)
    this.graphNetwork.on('oncontext', this.graphOnContext)
    this.graphNetwork.on('select', this.graphOnSelect)
    this.graphNetwork.on('stabilized', this.goToToolbarSelection)
  }

  @Watch('objects', { immediate: true, deep: false })
  refreshGraphData (): void {
    if (this.graphNetwork) {
      this.graphNetwork.setData(this.graphData)
    }
  }

  filterNodes (obj: ScribeObject): boolean {
    return this.toolbarData.typeFilter.includes(obj.type)
  }

  filterEdges (edge: ScribeLink): boolean {
    return edge.id !== undefined
  }

  filterChanged () {
    this.refreshGraphData()
  }

  fit () {
    console.log('fit emit catch')
    if (this.graphNetwork) {
      this.graphNetwork.fit()
    }
  }

  refresh () {
    console.log('refresh emit catch')
    this.refreshGraphData()
  }

  toggleAdvancedConfig () {
    console.log('toggle advanced emit catch')
    this.showConfigPanel = !this.showConfigPanel
  }

  @Watch('networkOptions', { deep: true })
  configChanged () {
    console.log('config changed')
    if (this.graphNetwork) {
      this.graphNetwork.setOptions(this.networkOptions as Options)
      this.setNetworkOptions(this.networkOptions)
    }
  }

  graphClicked (data?: any) {
    console.log('clicked')
  }

  graphDoubleClicked (data?: any) {
    console.log('double clicked')
  }

  graphOnContext (data?: any) {
    if (data && this.graphNetwork) {
      const pos = {
        x: data.pointer.DOM.x,
        y: data.pointer.DOM.y
      }
      console.log(pos)
      const id = this.graphNetwork.getNodeAt(pos)
      if (id) {
        this.contextData.x = data.event.clientX
        this.contextData.y = data.event.clientY
        this.contextData.itemId = id.toString()
        this.$nextTick(() => {
          this.contextData.visible = true
        })
      } else {
        this.contextData.visible = false
      }
    }
  }

  openInEditor () {
    if (this.contextData.itemId) {
      const obj = this.objects.get(this.contextData.itemId)
      if (obj) {
        this.$emit('open-in-editor', obj)
      }
    }
  }

  openInTimeline () {
    if (this.contextData.itemId) {
      const obj = this.objects.get(this.contextData.itemId)
      if (obj) {
        this.$emit('open-in-timeline', obj)
      }
    }
  }

  resetContext () {
    this.contextData.visible = false
    this.contextData.x = 0
    this.contextData.y = 0
    this.contextData.itemId = null
  }

  graphOnSelect (params?: any) {
    console.log('selected')
  }

  goToToolbarSelection () {
    if (this.toolbarData.autoCompleteSelection) {
      this.goToItem(this.toolbarData.autoCompleteSelection)
    }
  }

  goToItem (item: ScribeObject, attempt = 0) {
    if (this.graphNetwork && this.loaded) {
      console.log(this.nodes)
      const nodeItem = this.nodes.get(item.id)
      if (nodeItem === null) {
        this.snackbar.message = `Item ${item.name} does not exist`
        this.snackbar.visible = true
        return
      }

      this.graphNetwork.selectNodes([nodeItem.id])
      this.graphNetwork.moveTo({
        position: this.graphNetwork.getPosition(nodeItem.id),
        animation: true
      })
    } else {
      console.error('graph not available, or not yet loaded')
      if (attempt < 5) {
        this.$nextTick(() => {
          this.goToItem(item, attempt++)
        })
      }
    }
  }
}
</script>

<style scoped>
.full-height {
  height: 100%;
}
#graph-container {
  display: flex;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
}
#graph-toolbar {
  width: 100%;
}
#config-aside {
  top: 48px !important;
  height: calc(100% - 48px) !important;
}
.v-chip {
  padding: 5px;
}
</style>
