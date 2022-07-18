<template>
  <CarvisModal>
    <template slot="title-text">
      {{ title }} wirklich löschen?
    </template>
    <template slot="primary-button">
      <v-btn
        color="error"
        :loading="loading"
        @click="deleteShareableLink"
      >
        Löschen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import { modalsStore, notificationsStore, shareableLinksStore } from '@/store'
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { CarvisModal }})
export default class DeleteShareableLinkModal extends Vue {
  @Prop({ required: true })
  context!: ShareableLinkDto

  loading = false

  get title(): string {
    const car = this.context.carDetails 
      ? `${this.context.carDetails?.brand} ${this.context.carDetails?.type}` 
      : this.context.carId
    return `Link für ${this.context.ownerName} zu ${car}`
  }

  async deleteShareableLink(): Promise<void> {
    if (!this.context?.shareableLinkReference) return
    try {
      this.loading = true
      await shareableLinksStore.deleteShareableLink(this.context.shareableLinkReference)
      await notificationsStore.success('Geteilter Link erfolgreich gelöscht.')
      await modalsStore.close()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des geteilten Links. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
