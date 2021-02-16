<template>
  <div>
    <v-toolbar dense floating>
      <v-text-field prepend-icon="mdi-magnify" hide-detail single-line clearable>test</v-text-field>
    </v-toolbar>
    <v-treeview
     :items="items">
     </v-treeview>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      items: [
        { id: 1, name: 'Characters', children: [{ id: 2, name: 'test' }] }
      ],
      tree: [],
      icons: {
        book: 'mdi-book',
        session: 'mdi-book-open-variant',
        playerCharacter: 'mdi-account-circle',
        nonPlayerCharacter: 'mdi-account-circle-outline',
        place: 'mdi-map-marker'
      }
    }
  },
  computed: {
    getIconName (type, open) {
      return ''
    }
  }
}
</script>

<style scoped>
</style>
