<template>
  <v-container fill-height>
    <v-row no-gutters>
      <v-col cols="auto">
        <v-avatar
          size="128"
          rounded
          color="#FAFAFA"
          @click="portraitClicked"
          class="mr-5 bordered"
        >
          <v-img v-if="hasAvatarImg" :src="currentObj.portrait"></v-img>
          <v-icon x-large v-else>{{ iconForType }}</v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col>
            <v-text-field label="title" v-model="name"> </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <TagField :id="currentObj.id"></TagField>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="irlStartDate"
          label="Start Date (IRL)"
          type="datetime-local"
          :rules="[validateIrlStartDate]"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="irlEndDate"
          label="End Date (IRL)"
          type="datetime-local"
          :rules="[validateIrlEndDate]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="igStartDate"
          label="Start Date (in game)"
          type="datetime-local"
          :rules="[validateIgStartDate]"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="igEndDate"
          label="End Date (in game)"
          type="datetime-local"
          :rules="[validateIgEndDate]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="editor-row" no-gutters>
      <v-col>
        <ScribeTextEditor
          :owner="currentObj"
          :contents.sync="objectContents"
        ></ScribeTextEditor>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'
import { PayloadUpdateObject } from '@/store/StoreInterfaces'
import Delta from 'quill-delta'
import ScribeTextEditor from '@/components/ScribeTextEditor.vue'
import TagField from '@/components/TagField.vue'
import { ScribeTypeName, typeIcons } from '@/types/typeUtils'
import ScribeObject from '@/types/ScribeObject'
import Session from '@/types/Session'
import ReactiveMap from '@/types/ReactiveMap'
import { DateType } from 'vis-timeline'

@Component({
  components: { ScribeTextEditor, TagField }
})
export default class Editor extends Vue {
  @State('objects') objects!: ReactiveMap
  @State openTabs!: Array<string>
  @State tabIndex!: number
  @Getter('getCurrentTabObject') currentObj!: Session
  @Mutation updateObject!: (payload: PayloadUpdateObject) => void

  formatedDate (date: string): string {
    const index = date.indexOf('.')
    return index ? date.substring(0, index) : date
  }

  get hasAvatarImg (): boolean {
    return this.currentObj !== undefined
      ? this.currentObj.portrait !== undefined
      : false
  }

  get iconForType (): string {
    return typeIcons[this.currentObj.type]
  }

  get name (): string {
    return this.currentObj.name
  }

  set name (name: string) {
    this.currentObj.name = name
  }

  get irlStartDate (): string {
    return this.formatedDate(this.currentObj.irlStartDate.toISOString())
  }

  set irlStartDate (date: string) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'irlStartDate',
      value: new Date(date)
    })
  }

  get irlEndDate (): string {
    return this.formatedDate(this.currentObj.irlEndDate.toISOString())
  }

  set irlEndDate (end: string) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'irlEndDate',
      value: new Date(end)
    })
  }

  get igStartDate (): string {
    return this.formatedDate(this.currentObj.igStartDate.toISOString())
  }

  set igStartDate (start: string) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'igStartDate',
      value: new Date(start)
    })
  }

  get igEndDate (): string {
    return this.formatedDate(this.currentObj.igEndDate.toISOString())
  }

  set igEndDate (end: string) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'igEndDate',
      value: new Date(end)
    })
  }

  get objectContents (): Delta {
    return this.currentObj.content || new Delta()
  }

  set objectContents (updatedContent: Delta) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'content',
      value: updatedContent
    })
  }

  get sessionMax (): number {
    console.log(`Session number ${Session.nextSessionNumber}`)
    return Session.nextSessionNumber
  }

  validateIrlStartDate (date: string): boolean | string {
    if (!date) {
      return 'Date is required'
    }
    return (
      new Date(date).getTime() < new Date(this.irlEndDate).getTime() ||
      'Start date must be before end date'
    )
  }

  validateIrlEndDate (date: string): boolean | string {
    if (!date) {
      return 'Date is required'
    }
    return (
      new Date(date).getTime() > new Date(this.irlStartDate).getTime() ||
      'End date must be after start date'
    )
  }

  validateIgStartDate (date: string): boolean | string {
    if (!date) {
      return 'Date is required'
    }
    return (
      new Date(date).getTime() < new Date(this.igEndDate).getTime() ||
      'Start date must be before end date'
    )
  }

  validateIgEndDate (date: string): boolean | string {
    if (!date) {
      return 'Date is required'
    }
    return (
      new Date(date).getTime() > new Date(this.igStartDate).getTime() ||
      'End date must be after start date'
    )
  }

  contentsChanged (updatedContent: Delta) {
    this.objects[this.openTabs[this.tabIndex]].content = updatedContent
  }

  portraitClicked () {
    console.log('portrait clicked')
  }

  focused (event: any): void {
    console.log('focused')
  }
}
</script>

<style scoped>
.bordered {
  border: black solid 1px !important;
}
.container {
  justify-content: start;
}
.editor-row {
  height: 600px;
  flex: 1 1 100%;
}
</style>
