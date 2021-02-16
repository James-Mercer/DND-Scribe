<template>
  <app>
    <v-app-bar></v-app-bar>
    <v-main>
      <TreePanel></TreePanel>
      <EditorContainer></EditorContainer>
    </v-main>
  </app>
</template>

<script>
import TreePanel from '../components/TreePanel.vue'
import EditorContainer from '../components/EditorContainer.vue'

export default {
  data: () => {
    return {}
  },
  components: {
    TreePanel,
    EditorContainer
  }
}
</script>