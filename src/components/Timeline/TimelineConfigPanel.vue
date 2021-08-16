<template>
  <div>
    <v-toolbar>
      <v-btn @click="expandAll">
        <v-icon>mdi-arrow-expand-down</v-icon>
      </v-btn>
      <v-btn @click="collapseAll">
        <v-icon>mdi-arrow-collapse-up</v-icon>
      </v-btn>
    </v-toolbar>
    <v-expansion-panels v-model="expandedPanels" multiple accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>Timeline</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-checkbox
            v-model="config.showCurrentTime"
            label="Show Current Time"
          ></v-checkbox>
          <v-select
            v-model="config.orientation.axis"
            label="Axis orientation"
            :items="orientationOptions"
          ></v-select>
          <v-select
            v-model="config.orientation.item"
            label="Item orientation"
            :items="orientationOptions"
          ></v-select>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Session Styles</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-text-field
              v-model.number="styles.session.fontSize"
              label="Font Size"
              type="number"
            ></v-text-field>
            <v-select
              v-model.number="styles.session.fontFace"
              label="Font Face"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <color-input
              label="Font Color"
              :color.sync="styles.session.fontColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Background Color"
              :color.sync="styles.session.backgroundColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Border Color"
              :color="styles.session.borderColor"
            ></color-input>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="styles.session.borderWidth"
              label="Border Width"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="styles.session.borderRadius"
              label="Border Radius"
              type="number"
            ></v-text-field>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Character Styles</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-text-field
              v-model.number="styles.character.fontSize"
              label="Font Size"
              type="number"
            ></v-text-field>
            <v-select
              v-model.number="styles.character.fontFace"
              label="Font Face"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <color-input
              label="Font Color"
              :color.sync="styles.character.fontColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Background Color"
              :color.sync="styles.character.backgroundColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Border Color"
              :color="styles.character.borderColor"
            ></color-input>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="styles.character.borderWidth"
              label="Border Width"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="styles.character.borderRadius"
              label="Border Radius"
              type="number"
            ></v-text-field>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Location Styles</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-text-field
              v-model.number="styles.location.fontSize"
              label="Font Size"
              type="number"
            ></v-text-field>
            <v-select
              v-model.number="styles.location.fontFace"
              label="Font Face"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <color-input
              label="Font Color"
              :color.sync="styles.location.fontColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Background Color"
              :color.sync="styles.location.backgroundColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Border Color"
              :color="styles.location.borderColor"
            ></color-input>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="styles.location.borderWidth"
              label="Border Width"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="styles.location.borderRadius"
              label="Border Radius"
              type="number"
            ></v-text-field>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Organisation Styles</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-text-field
              v-model.number="styles.organisation.fontSize"
              label="Font Size"
              type="number"
            ></v-text-field>
            <v-select
              v-model.number="styles.organisation.fontFace"
              label="Font Face"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <color-input
              label="Font Color"
              :color.sync="styles.organisation.fontColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Background Color"
              :color.sync="styles.organisation.backgroundColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Border Color"
              :color="styles.organisation.borderColor"
            ></color-input>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="styles.organisation.borderWidth"
              label="Border Width"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="styles.organisation.borderRadius"
              label="Border Radius"
              type="number"
            ></v-text-field>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Artifact Styles</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item>
            <v-text-field
              v-model.number="styles.artifact.fontSize"
              label="Font Size"
              type="number"
            ></v-text-field>
            <v-select
              v-model.number="styles.artifact.fontFace"
              label="Font Face"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <color-input
              label="Font Color"
              :color.sync="styles.artifact.fontColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Background Color"
              :color.sync="styles.artifact.backgroundColor"
            ></color-input>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <color-input
              label="Border Color"
              :color="styles.artifact.borderColor"
            ></color-input>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="styles.artifact.borderWidth"
              label="Border Width"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="styles.artifact.borderRadius"
              label="Border Radius"
              type="number"
            ></v-text-field>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import DefaultTimelineOptions, { GroupStyles } from '@/types/TimelineOptions'
import ColorInput from '@/components/ColorInput.vue'

@Component({
  components: {
    ColorInput
  }
})
export default class TimelineConfigPanel extends Vue {
  @Prop({ required: true, type: DefaultTimelineOptions })
  config!: DefaultTimelineOptions

  @Prop({ required: true, type: GroupStyles })
  styles!: GroupStyles

  orientationOptions: Array<string> = ['bottom', 'top', 'both', 'none']

  expandedPanels: Array<number> = []
  expandAll () {
    this.expandedPanels = []
  }

  collapseAll () {
    this.expandedPanels = []
  }
}
</script>
