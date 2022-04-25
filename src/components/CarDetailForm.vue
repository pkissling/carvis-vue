<template>
  <div v-if="car">
    <OwnerCaption
      :owner="car.ownerName"
      :created-at="car.createdAt"
      :updated-at="car.updatedAt"
    />

    <v-form
      ref="form"
      v-model="valid"
      :disabled="!canEdit"
      @submit.stop.prevent="onSubmit"
    >
      <CarPreviewCard
        v-model="car.images"
        :can-edit="canEdit"
        :start-in-edit-mode="!car || !car.id"
      />

      <CarDataCard id="car-data-card"
                   v-model="car"
      />

      <ActionsCard
        v-if="canEdit"
        :is-new-item="car.id"
        @delete="showCarDeletionModal = true"
      />

      <DeleteModal
        v-if="showCarDeletionModal"
        :subject="deleteModalSubject"
        @submit="deleteCar"
        @cancel="showCarDeletionModal = false"
      />
    </v-form>
  </div>
</template>

<script lang="ts">
import DeleteModal from '@/components/modals/DeleteModal.vue'
import CarPreviewCard from '@/components/cards/CarPreviewCard.vue'
import CarDataCard from '@/components/cards/CarDataCard.vue'
import ActionsCard from '@/components/cards/ActionsCard.vue'
import { carsStore, commonStore, notificationsStore, userStore } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import OwnerCaption from '@/components/OwnerCaption.vue'

@Component({ components: { DeleteModal, ActionsCard, CarPreviewCard, CarDataCard, OwnerCaption }})
export default class CarDetailForm extends Vue {
  @Prop({ required: true })
  car!: CarDto

  showCarDeletionModal = false
  valid = true

  get loading(): boolean {
      return this.$auth.loading || commonStore.isLoading
  }

  get deleteModalSubject(): string {
      return `${this.car.brand} ${this.car.type}`
  }

   get canEdit(): boolean {
    if (!this.car || !this.car.id) {
      return true
    }

    return userStore.isAdmin || this.car.createdBy === userStore.getUserId
  }


  get creationDate(): string {
    const date = new Date(this.car.createdAt)
    const days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()
    return `${days}.${months}.${year}`
  }

  onSubmit(): void {
      const form = (this.$refs.form as Vue & { validate: () => boolean })
      form.validate()
      if (this.valid) {
        this.$emit('submit', this.car)
      } else {
        this.$vuetify.goTo('#car-data-card') // TODO go to specific item!
      }
  }

  async deleteCar(): Promise<void> {
    try {
      await carsStore.deleteCar(this.car.id)
      await notificationsStore.success('Fahrzeug erfolgreich gelöscht.')
      await this.$router.push({ path: '/cars' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Fahrzeugs. Bitte versuche es erneut.', err })
    } finally {
      this.showCarDeletionModal = false
    }
  }
}
</script>
