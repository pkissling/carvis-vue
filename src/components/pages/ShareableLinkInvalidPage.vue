<template>
  <Page title="Ungültiger Link">
    {{ reasonText }}
  </Page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'

@Component({ components: { Page }})
export default class ShareableLinkInvalidPage extends Vue {

  @Prop({ required: false })
  reason!: string

  get reasonText(): string | null {
    if (this.reason === null) {
      return null
    }

    switch (this.reason) {
      case 'car-deleted':
        return "Das Fahrzeug ist nicht mehr verfügbar."
      case 'link-deactivated':
        return "Der Link wurde vom Administrator deaktiviert."
      default:
        return null
    }
  }
}
</script>
