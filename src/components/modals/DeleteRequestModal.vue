<template>
  <CarvisModal>
    <template slot="title-text">
      {{ title }} wirklich löschen?
    </template>
    <template slot="primary-button">
      <v-btn
        color="error"
        :loading="loading"
        @click="deleteRequest"
      >
        Löschen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import { modalsStore, notificationsStore, requestsStore } from '@/store'
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { CarvisModal }})
export default class DeleteRequestModal extends Vue {
  @Prop({ required: true })
  context!: RequestDto

  loading = false

  get title(): string {
    return `${this.context.brand} ${this.context.type}`
  }

  async deleteRequest(): Promise<void> {
    try {
      this.loading = true
      await requestsStore.deleteRequest(this.context.id)
      await notificationsStore.success('Gesuch erfolgreich gelöscht.')
      await this.$router.push({ path: '/requests' })
      await modalsStore.close()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Gesuchs. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }}
</script>
