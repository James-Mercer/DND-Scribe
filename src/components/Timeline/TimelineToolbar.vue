<template>
  <v-toolbar id="timeline-toolbar" dense>
    <v-row dense>
      <v-col>
        <v-select
          v-model="filters"
          :items="typeFilterItems"
          label="Filter Types"
          eager
          single-line
          clearable
          multiple
          small-chips
          deletable-chips
          @change="filterChanged"
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
                  >(+{{ typeFilterItems.length - index }})</span
                >
              </template>
              <span>{{
                index === 3 ? typeFilterItems.slice(index).toString() : item
              }}</span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>
      <v-col>
        <v-autocomplete
          v-model="selection"
          :search-input.sync="query"
          label="Find Item"
          single-line
          :loading="autoCompleteLoading"
          :items="autoCompleteItems"
          itemid="id"
          item-text="name"
          item-value="id"
          return-object
          clearable
          @change="goToChanged"
        >
          <template v-slot:append-outer>
            <template v-if="selection !== null">
              <v-btn icon x-small @click="prevItem">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-list-item-action-text style="text-align: center;">
                {{ `${selectedIndex + 1}/${selectedItems.length}` }}
              </v-list-item-action-text>
              <v-btn icon x-small @click="nextItem">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col class="col-button">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              plain
              text
              elevation="0"
              :color="showAdvanced ? 'primary' : ''"
              @click="showAdvancedBtnClicked"
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
import Session from '@/types/Session'
import { typeNames, typeIcons, ScribeTypeName } from '@/types/typeUtils'
import ScribeObject from '@/types/ScribeObject'
import { ScribeTimelineItem } from '@/types/TimelineOptions'
import ReactiveMap from '@/types/ReactiveMap'
import goTo from 'vuetify/lib/services/goto'

@Component
export default class TimelineToolbar extends Vue {
  static Events = {
    filterChanged: 'filter-changed',
    goTo: 'go-to',
    showAdvanced: 'show-advanced'
  }

  @Prop({ required: true }) timelineItems!: Array<ScribeTimelineItem>
  @Prop() showAdvanced!: boolean
  @PropSync('config', { required: true }) filters!: Array<string>

  @State objects!: ReactiveMap

  autoCompleteLoading = false
  autoCompleteItems: Array<ScribeObject> = []

  selection: ScribeObject | null = null
  selectedItems: Array<ScribeTimelineItem> = []
  selectedIndex = 0
  query = ''

  @Watch('query')
  findObjects (query: string) {
    this.autoCompleteLoading = true
    setTimeout(() => {
      const filteredItems: Array<ScribeObject> = []
      this.objects.forEach(e => {
        if (e.name.toLowerCase().indexOf((query || '').toLowerCase()) > -1) {
          filteredItems.push(e)
        }
      })
      this.autoCompleteItems = filteredItems
      this.autoCompleteLoading = false
    }, 500)
  }

  get typeFilterItems () {
    return typeNames.filter((v: string) => {
      return !(v === Session.typeName || v === ScribeObject.typeName)
    })
  }

  filterChanged () {
    this.$emit(TimelineToolbar.Events.filterChanged)
  }

  goToChanged () {
    this.selectedItems = []
    if (this.selection !== null) {
      this.timelineItems.forEach((item: ScribeTimelineItem) => {
        if (item.id === this.selection?.id) {
          this.selectedItems.push(item)
        } else if (item.isLink && item.linkTo?.id === this.selection?.id) {
          this.selectedItems.push(item)
        }
      })
    }
    if (this.selectedItems.length > 0) {
      this.emitGoTo(this.selectedItems[0])
    }
  }

  prevItem () {
    if (this.selectedIndex > 0) {
      this.selectedIndex--
    }
    this.emitGoTo(this.selectedItems[this.selectedIndex])
  }

  nextItem () {
    if (this.selectedIndex < this.selectedItems.length - 1) {
      this.selectedIndex++
    }
    this.emitGoTo(this.selectedItems[this.selectedIndex])
  }

  emitGoTo (item: ScribeTimelineItem) {
    this.$emit(TimelineToolbar.Events.goTo, item)
  }

  showAdvancedBtnClicked () {
    this.$emit(TimelineToolbar.Events.showAdvanced)
  }

  iconForType (type: ScribeTypeName): string {
    return typeIcons[type]
  }

  setSelection (newSelection: ScribeObject) {
    this.selection = newSelection
    this.goToChanged()
  }
}
</script>

<style scoped>
#timline-toolbar {
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
.item-span {
  color: gray;
}
</style>
