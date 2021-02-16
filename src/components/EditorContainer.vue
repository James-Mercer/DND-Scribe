<template>
  <v-tabs
    next-icon="mdi-arrow-right-bold-box-outline"
    prev-icon="mdi-arrow-left-bold-box-outline"
    show-arrows >
    <v-tabs-slider></v-tabs-slider>
    <v-tab v-for="tab in tabs" :key="tab.name">{{ tab.name }}</v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.name">
        <v-card flat>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
export default {
  data: () => {
    return {
      tabs: [{ name: 'item 1' }, { name: 'item 2' }, { name: 'item 3' }, { name: 'item 4' }, { name: 'item 5' }, { name: 'item 6' }],
      tab: null,
      text: 'test values'
    }
  }
}
</script>
