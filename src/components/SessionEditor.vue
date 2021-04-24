<template>
  <div>
      <ScribeTextEditor />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ScribeTextEditor from '@/components/ScribeTextEditor.vue'

@Component({
  components: { ScribeTextEditor }
})
export default class SessionEditor extends Vue {
  testValue = 'test session title'

  changed (): void {
    console.log('change')
    console.log(this.$refs)
  }

  focused (event: any): void {
    console.log('focused')
  }
}
</script>
