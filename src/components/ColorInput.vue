<template>
  <v-card :elevation="expanded ? 2 : 0" width="100%">
    <v-btn
      class="text-left px-2"
      @click="toggleExpanded"
      width="100%"
      text
      :disabled="disabled"
    >
      {{ label }}
      <v-spacer></v-spacer>
      <v-icon :color="color">mdi-checkbox-blank-circle</v-icon>
      <v-icon>{{ getIcon(expanded) }}</v-icon>
    </v-btn>
    <v-color-picker
      class="color-picker"
      v-if="expanded && !disabled"
      mode="hexa"
      v-model="colorProp"
      :disabled="disabled"
    ></v-color-picker>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class ColorInput extends Vue {
  @Prop(String) label!: string
  @Prop(Boolean) disabled!: boolean
  @PropSync('color', { type: String, required: true }) colorProp!: string
  expanded = false

  toggleExpanded () {
    this.expanded = !this.expanded
  }

  getIcon (hover: boolean): string {
    return hover || this.expanded
      ? 'mdi-arrow-down-drop-circle-outline'
      : 'mdi-arrow-up-drop-circle-outline'
  }
}
</script>

<style scoped>
.color-dot {
  align-content: center;
  margin: auto;
}
</style>
