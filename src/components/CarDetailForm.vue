<template>
  <div v-if="car">
    <OwnerCaption
      :owner="car.ownerName"
      :created-at="car.createdAt"
      :updated-at="car.updatedAt"
      :created-by="car.createdBy"
      :show-details="!isAnonymous"
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
        @upload="uploading = $event"
      />

      <CarDataCard
        id="car-data-card"
        v-model="car"
      />

      <ActionsCard
        v-if="canEdit"
        :is-new-item="!car.id"
        :show-delete="true"
        :loading="saveLoading || uploading"
        @delete="showCarDeletionModal = true"
      />

      <DeleteModal
        v-if="showCarDeletionModal"
        :subject="deleteModalSubject"
        :loading="deleteLoading"
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
import { carsStore, notificationsStore } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import OwnerCaption from '@/components/OwnerCaption.vue'

@Component({ components: { DeleteModal, ActionsCard, CarPreviewCard, CarDataCard, OwnerCaption }})
export default class CarDetailForm extends Vue {
  @Prop({ required: true })
  car!: CarDto

  @Prop({ required: true})
  canEdit!: boolean

  @Prop({ required: false, default: null })
  saveCarFunction!: ((car: CarDto) => Promise<void>) | null

  showCarDeletionModal = false
  valid = true
  saveLoading = false
  deleteLoading = false
  uploading = false

  get deleteModalSubject(): string {
      return `${this.car.brand} ${this.car.type}`
  }

  get creationDate(): string {
    const date = new Date(this.car.createdAt)
    const days = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()
    return `${days}.${months}.${year}`
  }

  get isAnonymous(): boolean {
    return this.$route.meta?.requiresRole === undefined
  }

  async onSubmit(): Promise<void> {
    if (this.saveCarFunction === null) {
      return
    }
      const form = (this.$refs.form as Vue & { validate: () => boolean })
      form.validate()
      if (!this.valid) {
        this.$vuetify.goTo('#car-data-card') // TODO go to specific item!
        return
      }

      try {
        this.saveLoading = true
        await this.saveCarFunction(this.car)
      } finally {
        this.saveLoading = false
      }
  }

  async deleteCar(): Promise<void> {
    try {
      this.deleteLoading = true
      await carsStore.deleteCar(this.car.id)
      await notificationsStore.success('Fahrzeug erfolgreich gelöscht.')
      await this.$router.push({ path: '/cars' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Fahrzeugs. Bitte versuche es erneut.', err })
    } finally {
      this.showCarDeletionModal = false
      this.deleteLoading = false
    }
  }
}
</script>
