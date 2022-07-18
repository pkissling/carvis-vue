<template>
  <CarvisModal>
    <template slot="title-text">
      {{ title }} wirklich löschen?
    </template>
    <template slot="primary-button">
      <v-btn
        color="error"
        :loading="loading"
        @click="deleteCar"
      >
        Löschen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import { carsStore, modalsStore, notificationsStore } from '@/store'
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { CarvisModal }})
export default class DeleteCarModal extends Vue {
  @Prop({ required: true })
  context!: CarDto

  loading = false


  get title(): string {
    return `${this.context.brand} ${this.context.type}`
  }

  async deleteCar(): Promise<void> {
    try {
      this.loading = true
      await carsStore.deleteCar(this.context.id)
      await notificationsStore.success('Fahrzeug erfolgreich gelöscht.')
      await modalsStore.close()
      await this.$router.push({ path: '/cars' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Fahrzeugs. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
