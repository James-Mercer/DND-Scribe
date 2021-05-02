<template>
  <div class="scribe-text-editor" ref="scribeTextEditor">
    <div id="toolbar-container" ref="toolbarContainer">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-link"></button>
        <button class="custom-button" @click="showPromptOnLinkCreate"><v-icon>mdi-link</v-icon></button>
      </div>
    <div id="editor-container" ref="editorContainer"></div>
    <v-menu id="prompt-container" v-model="promptVisibilty" elevation="6" outlined tile
      absolute :position-x="promptX" :position-y="promptY" :close-on-click="true" :close-on-content-click="false">
      <div v-if="!promptViewingItem">
        <v-autocomplete
          id="autocomplete"
          flat filled solo
          dense hide-no-data hide-details
          v-model="autoCompleteSelect"
          :loading="autoCompleteLoading"
          :search-input.sync="autoCompleteSearch"
          label="Which item do you want to link?"
          :items="autoCompleteItems"
          item-text="name"
          item-value="id"
          return-object
        >
        </v-autocomplete>
        <v-btn icon @click="createScribeLink"><v-icon>mdi-check</v-icon></v-btn>
      </div>
      <div v-else>
        <v-btn @click="openScribeLink"  small>open</v-btn>
        <v-btn @click="editScribeLink" small>edit</v-btn>
        <v-btn @click="removeScribeLink" small>remove</v-btn>
      </div>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter, Action, Mutation } from 'vuex-class'
import Campaign from '@/types/Campaign'
import ScribeObject from '@/types/ScribeObject'
import Quill, { RangeStatic, StringMap } from 'quill'
import PopupPromptData from '@/types/PopupPromptData'

class ScribeLink extends Quill.import('blots/inline') {
  static create (value: any): Element {
    const node: Element = super.create(value)
    node.setAttribute('ScribeOREF', value)
    return node
  }
}
ScribeLink.blotName = 'ScribeLink'
ScribeLink.tagName = 'a'

Quill.register(ScribeLink, false)

@Component({})
export default class ScribeTextEditor extends Vue {
  editor: Quill
  value = ''

  // Class for generic popup data
  promptData: PopupPromptData = new PopupPromptData()
  // Popup mode
  promptViewingItem = true // if false its viewing a link
  promptItemID = ''
  // AutoComplete Data
  autoCompleteLoading = false
  autoCompleteSearch = ''
  autoCompleteSelect: ScribeObject|null = null
  autoCompleteItems: Array<ScribeObject> = []

  constructor () {
    super()
    this.editor = new Quill(this.$refs.editorContainer as HTMLElement)
  }

  mounted () {
    const editorElement: HTMLElement = this.$refs.editorContainer as HTMLElement
    this.editor = new Quill(editorElement, {
      modules: { toolbar: this.$refs.toolbarContainer as HTMLElement },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    })
    editorElement.addEventListener('click', this.onClick, true)
    console.log(this.promptData)
  }

  @Getter('getObjects') objectUuidMap!: Map<string, ScribeObject>
  @Mutation('addTab') addTab !: (itemID: string, index: number, focus: boolean) => void

  @Watch('autoCompleteSearch')
  onSearchChange (val: string, oldVal: string) {
    this.querySelection(val)
  }

  get promptX (): number {
    return this.promptData.getX()
  }

  get promptY (): number {
    return this.promptData.getY()
  }

  get promptVisibilty (): boolean {
    return this.promptData.getVisible()
  }

  set promptVisibilty (val: boolean) {
    this.promptData.setVisible(val)
  }

  // Set Propmt position and visibiltiy
  showPromptOnLinkCreate (): void {
    this.resetPrompt()
    this.promptViewingItem = false
    this.editor.focus()
    const editorBounds = this.editor.root.getBoundingClientRect()
    const selectedText = this.editor.getSelection(false)
    if (selectedText) {
      const SelectionBounds = this.editor.getBounds(selectedText.index, selectedText.length)
      this.promptData.setPosition(editorBounds.x + SelectionBounds.left, editorBounds.y + SelectionBounds.bottom)
      if (selectedText != null) {
        this.$nextTick(() => { this.promptData.setVisible(true) })
      }
    }
  }

  showPromptOnLinkClick (x: number, y: number): void {
    this.resetPrompt()
    this.promptViewingItem = true
    this.promptData.setPosition(x, y)
    this.$nextTick(() => { this.promptData.setVisible(true) })
  }

  resetPrompt (): void {
    this.promptData.setVisible(false)
    this.autoCompleteSearch = ''
    this.autoCompleteSelect = null
  }

  querySelection (filterTerm: string) {
    this.autoCompleteLoading = true
    setTimeout(() => {
      const filteredItems: Array<ScribeObject> = []
      this.objectUuidMap.forEach(e => {
        if (e.name.toLowerCase().indexOf((filterTerm || '').toLowerCase()) > -1) {
          filteredItems.push(e)
        }
      })
      this.autoCompleteItems = filteredItems
      this.autoCompleteLoading = false
    }, 500)
  }

  createScribeLink () {
    if (this.autoCompleteSelect === null) {
      return false
    }
    let selection: RangeStatic | null = this.editor.getSelection(true)
    const objectId: string = this.autoCompleteSelect?.id
    const objectName: string = this.autoCompleteSelect.name
    if (!(selection && selection.length > 0)) { // if no selection insert the name of the object and format that
      this.editor.insertText(selection?.index || 0, objectName)
      this.editor.setSelection(selection?.index || 0, objectName.length)
      selection = this.editor.getSelection(false)
      if (selection === null) { return }
    }
    this.editor.formatText(selection?.index, selection?.length, 'ScribeLink', objectId) // toDo: Validate formatted text
  }

  onClick (ev: MouseEvent) {
    const targetElement: HTMLElement = ev.target as HTMLElement
    if (targetElement.tagName.toLowerCase() === 'a' && targetElement.hasAttribute('ScribeOREF')) {
      console.log('Scribe Link Clicked')
      ev.stopPropagation()
      const bounds: DOMRect = targetElement.getBoundingClientRect()
      this.promptItemID = targetElement.getAttribute('ScribeOREF') || ''
      this.showPromptOnLinkClick(bounds.x, bounds.bottom)
    }
  }

  openScribeLink () {
    console.log(`open item ${this.promptItemID}`)
    this.addTab(this.promptItemID, -1, true)
  }

  editScribeLink () {
    console.log(`edit link to item ${this.promptItemID}`)
  }

  removeScribeLink () {
    console.log(`remove link to item ${this.promptItemID}`)
  }
}
</script>

<style scoped>
  @import '../../node_modules/quill/dist/quill.snow.css';
  #editor {
    height: 100%;
    overflow: visible;
  }
  #prompt-container {
    position: absolute;
    display: flex;
    flex-direction: row;
    width: 500px;
    height: 24px;
  }
  #autocomplete {
  }
</style>
