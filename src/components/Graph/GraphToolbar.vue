<template>
  <v-toolbar id="graph-toolbar" dense>
    <v-row dense>
      <v-col id="col-type-filter">
        <v-select
          id="type-filter"
          eager
          single-line
          clearable
          multiple
          small-chips
          deletable-chips
          v-model="typeFilter"
          :items="typeNames"
          label="Filter types"
        >
          <template v-slot:prepend>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>Filter Nodes by type</span>
            </v-tooltip>
          </template>
          <template v-slot:selection="{ item, index }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip v-if="index < 3" small v-bind="attrs" v-on="on">
                  <span
                    ><v-icon small>{{ iconForType(item) }}</v-icon></span
                  >
                </v-chip>
                <span v-if="index === 3" v-bind="attrs" v-on="on"
                  >(+{{ typeFilter.length - index }})</span
                >
              </template>
              <span>{{
                index === 3 ? typeFilter.slice(index).toString() : item
              }}</span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>
      <v-col id="col-find">
        <v-autocomplete
          v-model="data.autoCompleteSelection"
          :search-input.sync="searchTerm"
          :items="acItems"
          itemid="id"
          item-text="name"
          return-object
          :loading.sync="acLoading"
          label="find item"
          single-line
          clearable
          @change="selectionMade"
          @keydown.enter="selectionMade"
        >
          <template v-slot:prepend>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>Search for a item in the graph</span>
            </v-tooltip>
          </template>
          <template v-slot:append>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" @click="selectionMade"
                  >mdi-magnify</v-icon
                >
              </template>
              <span>search</span>
            </v-tooltip>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col id="col-fit" class="col-button">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              plain
              tile
              elevation="0"
              @click="fitClicked"
              ><v-icon>mdi-fit-to-page</v-icon></v-btn
            >
          </template>
          <span>Fit graph to view</span>
        </v-tooltip>
      </v-col>
      <v-col id="col-refresh" class="col-button">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              plain
              tile
              elevation="0"
              @click="refreshClicked"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
          </template>
          <span>Refresh Graph Data</span>
        </v-tooltip>
      </v-col>
      <v-col id="col-show-advanced-config" class="col-button">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :plain="!showAdvanced"
              tile
              elevation="0"
              :color="showAdvanced ? 'primary' : ''"
              @click="showAdvanced = !showAdvanced"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <span>Show Advanced Config</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { typeNames, typeIcons, ScribeTypeName } from '@/types/typeUtils'
import ScribeObject from '@/types/ScribeObject'
import ReactiveMap from '@/types/ReactiveMap'

export class GraphToolbarData {
  typeFilter: Array<string> = typeNames
  tagFilter: Array<string> = []
  autoCompleteSelection: ScribeObject | null = null
}

@Component
export default class GraphToolbar extends Vue {
  static Events = {
    selectionMade: 'selection-made',
    refresh: 'refresh',
    fit: 'fit',
    filterChanged: 'filter-changed'
  }

  @State objects!: ReactiveMap

  @Prop({ required: true, type: Object })
  data!: GraphToolbarData

  @PropSync('advanced', { required: true, type: Boolean })
  showAdvanced!: boolean

  model: any

  searchTerm = ''
  acItems: ScribeObject[] = []
  acLoading = false

  get typeNames (): Array<string> {
    return typeNames
  }

  get typeFilter () {
    return this.data.typeFilter
  }

  set typeFilter (filter: Array<string>) {
    this.data.typeFilter = filter
  }

  mounted () {
    this.search('')
  }

  iconForType (type: ScribeTypeName): string {
    return typeIcons[type]
  }

  @Watch('typeFilter')
  filterChanged () {
    this.$emit(GraphToolbar.Events.filterChanged)
  }

  @Watch('toggleModel')
  tgModel (val: any) {
    console.log(this.model)
  }

  @Watch('searchTerm')
  search (query: string) {
    this.acLoading = true
    setTimeout(() => {
      const filteredItems: Array<ScribeObject> = []
      this.objects.forEach(e => {
        if (e.name.toLowerCase().indexOf((query || '').toLowerCase()) > -1) {
          filteredItems.push(e)
        }
      })
      this.acItems = filteredItems
      this.acLoading = false
    }, 500)
  }

  selectionMade () {
    // Trigger a search in the graph to find and highlight items
    this.$emit(GraphToolbar.Events.selectionMade)
  }

  fitClicked () {
    this.$emit(GraphToolbar.Events.fit)
  }

  refreshClicked () {
    this.$emit(GraphToolbar.Events.refresh)
  }
}
</script>

<style scoped>
#graph-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.row,
.col,
.spacer {
  height: 100%;
}
.col-button {
  flex-grow: 0;
  flex-basis: 20px;
}
.v-btn {
  padding: 0px 5px 0px 5px !important;
}
.v-select__selections {
  flex-wrap: nowrap;
}
.v-chip {
  padding: 6px;
}
#type-select {
  max-height: 100%;
}
</style>
