<template>
  <v-container id="scribe-text-editor">
    <div id="toolbar-container" ref="toolbar">
      <span class="ql-formats">
        <select class="ql-font"></select>
        <select class="ql-size"></select>
      </span>
      <span class="ql-format">
        <button class="ql-color"></button>
        <button class="ql-background"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
      </span>
      <span class="ql-format">
        <button class="ql-clean"></button>
      </span>
    </div>
    <div id="editor-container" ref="editor"></div>

    <v-dialog id="prompt-container" v-model="showLinkDialog" max-width="600px">
      <v-tabs v-model="dialogTab" fixed-tabs>
        <v-tab>Hyperlink</v-tab>
        <v-tab>Scribe-Doc</v-tab>
      </v-tabs>
      <v-tabs-items v-model="dialogTab">
        <v-tab-item>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="hyperlinkText"
                  placeholder="Insert hyperlink here..."
                  @keypress.enter="submitHyperlink"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex">
                <v-spacer></v-spacer>
                <v-btn @click="resetDialog" color="red"> Cancel </v-btn>
                <v-btn
                  @click="submitHyperlink"
                  :disabled="!hyperlinkText"
                  color="primary"
                >
                  Create
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-row no-gutters>
              <v-col>
                <v-autocomplete
                  id="autocomplete"
                  flat
                  filled
                  v-model="autoCompleteSelect"
                  :loading="autoCompleteLoading"
                  :search-input.sync="autoCompleteSearch"
                  label="Link Document"
                  hint="Search for document"
                  :items="autoCompleteItems"
                  item-text="name"
                  item-value="id"
                  return-object
                  @keypress.enter="submitScribeLink"
                >
                  <template v-slot:append>
                    <v-btn icon @click="submitScribeLink">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  v-model="linkLabel"
                  label="Label"
                  @keypress.enter="submitScribeLink"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex">
                <v-spacer></v-spacer>
                <v-btn @click="resetDialog" color="red"> Cancel </v-btn>
                <v-btn
                  @click="submitScribeLink"
                  :disabled="!autoCompleteSelect"
                  color="primary"
                >
                  Create
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-dialog>

    <v-menu
      v-model="contextData.visible"
      :position-x="contextData.x"
      :position-y="contextData.y"
      elevation="6"
      outlined
      tile
      absolute
      :close-on-click="true"
      :close-on-content-click="false"
    >
      <v-btn @click="openLink" small text>open</v-btn>
      <v-btn @click="editLink" small text>edit</v-btn>
      <v-btn @click="removeLink" small text>remove</v-btn>
    </v-menu>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync, Prop } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'
import ScribeObject, { ScribeLink as ScribeLinkObj } from '@/types/ScribeObject'
import { PayloadAddTab } from '@/store/StoreInterfaces'
import Quill, { RangeStatic } from 'quill'
import Delta from 'quill-delta'
import ReactiveMap from '@/types/ReactiveMap'
import { IdType } from 'vis-network/peer'

const scribeAttribute = 'ScribeLink'
// Custom Link format for Non-webLinks
class ScribeLink extends Quill.import('blots/inline') {
  static create (value: string): Element {
    const node: Element = super.create(value)
    node.setAttribute(scribeAttribute, value)
    return node
  }

  static formats (domNode: Element) {
    return domNode.getAttribute(scribeAttribute) || true
  }

  format (name: string, value: string) {
    if (name === scribeAttribute && value) {
      this.domNode.setAttribute(scribeAttribute, value)
    } else {
      super.format(name, value)
    }
  }

  formats () {
    const formats = super.formats()
    formats[scribeAttribute] = ScribeLink.formats(this.domNode)
    return formats
  }
}
ScribeLink.blotName = scribeAttribute
ScribeLink.className = scribeAttribute
ScribeLink.tagName = 'A'

Quill.register(ScribeLink, false)

interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
  targetID: string;
  targetType: string;
}

@Component({})
export default class ScribeTextEditor extends Vue {
  @PropSync('contents', { type: Object }) syncedContents!: Delta
  @Prop({ required: true, type: Object }) owner!: ScribeObject
  editor: Quill | undefined

  contextData: ContextMenu = {
    x: 0,
    y: 0,
    visible: false,
    targetID: '',
    targetType: ''
  }

  showLinkDialog = false
  editItem = true // if false its viewing a link
  dialogTab: any = null
  elementClicked: HTMLElement | null = null
  // AutoComplete Data
  autoCompleteLoading = false
  autoCompleteSearch = ''
  autoCompleteSelect: ScribeObject | null = null
  autoCompleteItems: Array<ScribeObject> = []
  linkLabel = ''
  // hyperlink text
  hyperlinkText = ''

  mounted () {
    const editorElement: HTMLElement = this.$refs.editor as HTMLElement
    this.editor = new Quill(editorElement, {
      modules: {
        toolbar: this.$refs.toolbar as HTMLElement
      },
      placeholder: 'Enter text here...',
      theme: 'snow'
    })
    const toolbar: any = this.editor.getModule('toolbar')
    toolbar.addHandler('link', this.showDialogLinkCreate)
    this.editor.setContents(this.syncedContents)
    editorElement.addEventListener('click', this.onClick, true)
    this.editor.on('text-change', () => {
      if (this.editor !== undefined) {
        this.syncedContents = this.editor.getContents()
      }
    })
  }

  @State objects!: ReactiveMap
  @Getter getCurrentTabObject: ScribeObject | undefined
  @Mutation addTab!: (payload: PayloadAddTab) => void

  @Mutation removeObject!: (id: string) => void
  @Mutation('createLink') createGraphLink!: (edge: ScribeLinkObj) => void
  @Mutation('removeLink') removeGraphLink!: (edge: ScribeLinkObj) => void

  @Watch('autoCompleteSearch')
  onSearchChange (val: string, oldVal: string) {
    this.querySelection(val)
  }

  get isEditingLink (): boolean {
    return this.elementClicked !== null
  }

  resetDialog () {
    this.showLinkDialog = false
    this.autoCompleteSearch = ''
    this.autoCompleteSelect = null
    this.linkLabel = ''
    this.hyperlinkText = ''
    this.elementClicked = null
  }

  showDialogLinkCreate (): void {
    this.resetDialog()
    if (this.editor === undefined) {
      return
    }

    this.editor.focus()
    this.$nextTick(() => {
      this.showLinkDialog = true
    })
  }

  showDialogLinkEdit (): void {
    if (this.editor) {
      this.editor.focus()
    }
    console.log('edit')

    const element = this.elementClicked
    this.resetDialog()
    this.elementClicked = element
    if (this.elementClicked !== null) {
      const objID = this.elementClicked.getAttribute(scribeAttribute)
      if (objID !== null) {
        this.editItem = true
        this.autoCompleteSelect = this.objects.get(objID) || null
        if (this.getCurrentTabObject) {
          const link = this.getCurrentTabObject.links.find(
            (link: ScribeLinkObj) => {
              return link.to === this.autoCompleteSelect?.id
            }
          )
          if (link) {
            this.linkLabel = link.label
          }
        }
      }
    }

    this.$nextTick(() => {
      this.showLinkDialog = true
    })
  }

  querySelection (filterTerm: string) {
    this.autoCompleteLoading = true
    setTimeout(() => {
      const filteredItems: Array<ScribeObject> = []
      this.objects.forEach(e => {
        if (
          e.name.toLowerCase().indexOf((filterTerm || '').toLowerCase()) > -1
        ) {
          filteredItems.push(e)
        }
      })
      this.autoCompleteItems = filteredItems
      this.autoCompleteLoading = false
    }, 500)
  }

  submitHyperlink () {
    if (!this.isEditingLink) {
      console.log('create hyperlink')
      this.createHyperlink()
    } else {
      console.log('edit hyperlink')
      this.editHyperlink()
    }
  }

  submitScribeLink () {
    if (
      this.autoCompleteSelect === null &&
      this.autoCompleteSelect === undefined
    ) {
      return
    }

    if (!this.isEditingLink) {
      console.log('create scribelink')
      this.createScribeLink()
    } else {
      console.log('edit scribe')
      this.editScribeLink()
    }
  }

  showContextMenu (x: number, y: number): void {
    this.contextData.x = x
    this.contextData.y = y
    this.$nextTick(() => {
      this.contextData.visible = true
    })
  }

  createScribeLink (): boolean {
    if (this.autoCompleteSelect === null || !this.autoCompleteSelect.id) {
      return false
    }
    if (this.editor === undefined) {
      return false
    }

    let selection: RangeStatic | null = this.editor.getSelection(true)
    const objectId: IdType = this.autoCompleteSelect?.id
    const objectName: string = this.autoCompleteSelect.name

    if (!(selection && selection.length > 0)) {
      // if no selection insert the name of the object and format that
      this.editor.insertText(selection?.index || 0, objectName)
      this.editor.setSelection(selection?.index || 0, objectName.length)
      selection = this.editor.getSelection(false)
    }
    if (selection === null) {
      return false
    }

    const format = this.editor.formatText(
      selection.index,
      selection.length,
      'ScribeLink',
      objectId
    )
    console.log(format)
    this.createGraphLink(
      new ScribeLinkObj(
        objectId.toString(),
        this.owner.id.toString(),
        this.linkLabel
      )
    )
    this.resetDialog()
    return true
  }

  editScribeLink (): void {
    const objectId: IdType | null = this.autoCompleteSelect?.id || null
    if (this.elementClicked === null || objectId === null) {
      return
    }

    if (this.elementClicked.hasAttribute(scribeAttribute)) {
      const id: string | null = this.elementClicked.getAttribute(
        scribeAttribute
      )
      if (id !== null) {
        this.removeGraphLink(
          new ScribeLinkObj(this.owner.id.toString(), id.toString())
        )
      }
    } else {
      this.elementClicked.removeAttribute('href')
    }
    this.elementClicked.setAttribute(scribeAttribute, objectId.toString())
    this.createGraphLink(
      new ScribeLinkObj(
        this.owner.id.toString(),
        objectId.toString(),
        this.linkLabel
      )
    )
  }

  createHyperlink (): boolean {
    console.log('create hyperlink')
    if (this.editor === undefined) {
      return false
    }
    let selection: RangeStatic | null = this.editor.getSelection(true)
    if (!(selection && selection.length > 0)) {
      this.editor.insertText(selection?.index || 0, this.hyperlinkText)
      this.editor.setSelection(selection?.index || 0, this.hyperlinkText.length)
      selection = this.editor.getSelection(false)
    }

    if (selection === null) {
      return false
    }

    this.editor.formatText(
      selection?.index,
      selection?.length,
      'link',
      this.hyperlinkText
    )
    this.resetDialog()
    return true
  }

  editHyperlink (): void {
    if (this.elementClicked === null) {
      return
    }
    this.elementClicked.setAttribute('href', this.hyperlinkText)
  }

  onClick (ev: MouseEvent) {
    const targetElement: HTMLElement = ev.target as HTMLElement
    if (
      targetElement.tagName.toLowerCase() === 'a' &&
      targetElement.hasAttribute(scribeAttribute)
    ) {
      console.log('Scribelink clicked')
      const bounds: DOMRect = targetElement.getBoundingClientRect()
      this.resetDialog()
      this.elementClicked = targetElement
      console.log(this.elementClicked)
      this.showContextMenu(bounds.x, bounds.bottom)
    }
  }

  openLink () {
    if (this.elementClicked === null) {
      return
    }

    const objectId: string | null = this.elementClicked.getAttribute(
      scribeAttribute
    )
    if (objectId === null) {
      return
    }
    console.log(`open item ${objectId}`)
    const payload: PayloadAddTab = { id: objectId, index: -1, focus: true }
    this.addTab(payload)
  }

  editLink () {
    if (this.elementClicked === null) {
      return
    }
    this.showDialogLinkEdit()
  }

  removeLink () {
    if (this.elementClicked === null) {
      console.log('no element')
      return
    }
    if (this.editor === undefined) {
      return
    }

    const objectId: string | null = this.elementClicked.getAttribute(
      scribeAttribute
    )
    if (objectId === null) {
      return
    }
    console.log(`remove item ${objectId}`)
    console.log(objectId)
    this.editor.deleteText(
      this.editor.getIndex(Quill.find(this.elementClicked)),
      this.elementClicked.innerText.length
    )
    this.removeGraphLink(
      new ScribeLinkObj(this.owner.id.toString(), objectId.toString())
    )
    this.resetDialog()
  }
}
</script>

<style scoped>
@import '../../node_modules/quill/dist/quill.snow.css';
#scribe-text-editor {
  width: 100%;
  height: 100%;
}
#editor-container {
  width: 100%;
  height: 100%;
}
#prompt-container {
  position: absolute;
  display: none;
  width: 0;
  height: 0;
}
#autocomplete {
}
</style>
