<template>
  <v-combobox
    v-model="model"
    label="Add or create Tags"
    chips
    multiple
    outlined
    dense
    hide-selected
    :hide-no-data="!search"
    :items="tags"
    id="label"
    item-text="label"
    item-color="color"
    :search-input.sync="search"
  >
    <template v-slot:no-data>
      <v-list-item>
        <span class="subheading">Create tag</span>
        <v-chip label small class="ml-5">
          {{ search }}
        </v-chip>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        :color="item.color"
        :input-value="selected"
        label
        small
      >
        <span class="pr-2">
          {{ item.label }}
        </span>
        <v-icon small @click="parent.selectItem(item)">
          $delete
        </v-icon>
      </v-chip>
    </template>
    <template v-slot:item="{ index, item }">
      <v-text-field
        v-if="editing === item"
        v-model="editing.label"
        autofocus
        flat
        background-color="transparent"
        hide-details
        solo
        @keydown.enter="edit(index, item)"
      ></v-text-field>
      <v-chip v-else :color="item.color" label small>
        {{ item.label }}
      </v-chip>
      <v-spacer></v-spacer>
      <v-list-item-action @click.stop>
        <v-btn icon @click.stop.prevent="edit(index, item)">
          <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Tag from '@/types/Tag'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { PayloadUpdateObject } from '@/store/StoreInterfaces'

@Component({})
export default class TagField extends Vue {
  @Prop({ required: true }) id!: string
  @State tags!: Array<Tag>
  @Mutation addTag!: (tag: Tag) => void
  @Mutation updateTag!: (tag: Tag) => void
  @Mutation updateObject!: (payload: PayloadUpdateObject) => void

  search = ''
  editing: null | Tag = null
  editingIndex = -1
  model: Array<Tag | string> = []

  edit (index: number, item: Tag) {
    if (this.editing === null) {
      this.editing = item
      this.editingIndex = index
    } else {
      // update the edited changes
      this.updateTag(this.editing)
      this.editing = null
      this.editingIndex = -1
    }
  }

  filter (item: Tag, queryText: string, itemText: string) {
    // if (item.header) return false

    const text = this.hasValue(itemText)
    const query = this.hasValue(queryText)

    return (
      text
        .toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    )
  }

  hasValue (val: string): string {
    return val != null ? val : ''
  }

  @Watch('model')
  modelChanged (val: Array<Tag>, prev: Array<Tag>) {
    if (val.length === prev.length) {
      return
    }
    this.model = val.map(v => {
      if (typeof v === 'string') {
        console.log(`${v} is a string create tag for it`)
        v = new Tag(v)
        this.addTag(v)
      }
      return v
    })
    const ids: Array<number> = []
    this.model.forEach((value: Tag | string) => {
      if (typeof value !== 'string') {
        ids.push(value.id)
      }
    })
    this.updateObject({ id: this.id, field: 'tags', value: ids })
  }

  @Watch('tags', { deep: true })
  tagsChanged (val: Array<string>, prev: Array<string>) {
    console.log(val)
    console.log(prev)
  }
}
</script>
