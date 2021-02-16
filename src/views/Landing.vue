<template>
  <app>
    <v-main>
      <v-sheet>
        <v-card>
          <v-card-title> Start </v-card-title>
          <v-card-actions>
            <v-btn block elevation="6"> new </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn block elevation="6"> open </v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title> Recent </v-card-title>
          <v-card-actions v-for="recentCampaign in recentCampaigns" :key="recentCampaign">
            <v-btn block elevation="6"> {{recentCampaign}} </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-main>
  </app>
</template>

<script>
export default {
  data: () => {
    return { recentCampaigns: ['project 1', 'project 2', 'project 3'] }
  },
  components: {}
}
</script>
