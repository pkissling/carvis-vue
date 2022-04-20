<template>
  <div v-if="car">
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
        :id="car.id"
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

<script>
import DeleteModal from '@/components/modals/DeleteModal.vue'
import CarPreviewCard from '@/cards/CarPreviewCard.vue'
import CarDataCard from '@/cards/CarDataCard.vue'
import ActionsCard from '@/cards/ActionsCard.vue'
import { carsStore, commonStore, notificationsStore, userStore } from '@/store'

export default {
  components: {
    DeleteModal,
    CarDataCard,
    CarPreviewCard,
    ActionsCard
  },
  props: {
    car: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      showCarDeletionModal: false,
      valid: true
    }
  },
  computed: {
    loading() {
      return this.$auth.loading || commonStore.isLoading
    },
    deleteModalSubject() {
      return `${this.car.brand} ${this.car.type}`
    },
    canEdit() {
      if (!this.car || !this.car.id) {
        return true
      }

      return userStore.isAdmin || this.car.createdBy === userStore.getUsername
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('submit', this.car)
      } else {
        this.$vuetify.goTo('#car-data-card') // TODO go to specific item!
      }
    },
    deleteCar() {
      carsStore
        .deleteCar(this.car.id)
        .then(() =>
          notificationsStore.success('Fahrzeug erfolgreich gelöscht.')
        )
        .then(() => this.$router.push({ path: '/cars' }))
        .catch(err =>
          notificationsStore.error({
            message:
              'Fehler beim Löschen des Fahrzeugs. Bitte versuche es erneut.',
            err
          })
        )
        .finally(() => (this.showCarDeletionModal = false))
    }
  }
}
</script>
