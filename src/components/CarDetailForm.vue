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
        @delete="openCarDeletionModal"
      />
    </v-form>
  </div>
</template>

<script lang="ts">
import CarPreviewCard from '@/components/cards/CarPreviewCard.vue'
import CarDataCard from '@/components/cards/CarDataCard.vue'
import ActionsCard from '@/components/cards/ActionsCard.vue'
import { modalsStore } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import OwnerCaption from '@/components/OwnerCaption.vue'

@Component({ components: { ActionsCard, CarPreviewCard, CarDataCard, OwnerCaption }})
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
  uploading = false

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

  async openCarDeletionModal(): Promise<void> {
    await modalsStore.open({ name: 'DeleteCarModal', context: this.car })
  }
}
</script>
