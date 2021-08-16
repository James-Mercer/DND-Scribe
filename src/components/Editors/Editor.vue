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
          <v-icon x-large v-if="!hasAvatarImg">{{ iconForType }}</v-icon>
          <v-img v-else :src="currentObj.portrait"></v-img>
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
import { typeIcons } from '@/types/typeUtils'
import ScribeObject from '@/types/ScribeObject'
import ReactiveMap from '@/types/ReactiveMap'

@Component({
  components: { ScribeTextEditor, TagField }
})
export default class Editor extends Vue {
  @State('objects') objects!: ReactiveMap
  @State openTabs!: Array<string>
  @State tabIndex!: number
  @Getter('getCurrentTabObject') currentObj!: ScribeObject
  @Mutation updateObject!: (payload: PayloadUpdateObject) => void

  get hasAvatarImg (): boolean {
    return this.currentObj.portrait !== undefined
  }

  get iconForType (): string {
    return typeIcons[this.currentObj.type]
  }

  get name (): string {
    return this.currentObj.name
  }

  set name (name: string) {
    this.updateObject({
      id: this.currentObj.id,
      field: 'name',
      value: name
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
