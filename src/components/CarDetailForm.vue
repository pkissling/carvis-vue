<template>
  <!-- TODO use a guad to prepolulate -->
  <div v-if="car">
    <v-form
      ref="form"
      v-model="valid"
      :disabled="readOnly"
      @submit.stop.prevent="onSubmit"
    >
      <CarPreviewCard
        v-model="car.images"
        :can-edit="canEdit"
        :start-in-edit-mode="!car || !car.id"
      />

      <CarDataCard
        id="car-data-card"
        v-model="car"
      />

      <ActionsCard
        v-if="!readOnly"
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
import notificationService from '../service/notification-service'
import userService from '../service/user-service'
import DeleteModal from '../modals/DeleteModal.vue'
import CarPreviewCard from '../cards/CarPreviewCard.vue'
import CarDataCard from '../cards/CarDataCard.vue'
import ActionsCard from '../cards/ActionsCard.vue'

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
    loading () {
      return this.$auth.loading || this.$store.getters['common/isLoading']
    },
    readOnly () {
      if (this.car.id === undefined) {
        return false
      }
      if (this.car.createdBy === userService.getUsername()) {
        return false
      }
      return true
    },
    deleteModalSubject () {
      return `${this.car.brand} ${this.car.type}`
    },
    canEdit () {
      if (!this.car || !this.car.id) {
        return true
      }

      return this.car.createdBy === userService.getUsername()
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('submit', this.car)
      } else {
        this.$vuetify.goTo('#car-data-card') // TODO go to specific item!
      }
    },
    deleteCar() {
      this.showCarDeletionModal = false
      this.$store.dispatch('cars/deleteCar', this.car.id)
        .then(() => notificationService.success('Fahrzeug erfolgreich gelöscht.'))
        .then(() => this.$router.push({ path: '/cars' }))
        .catch(err => notificationService.error('Fehler beim Löschen des Fahrzeugs. Bitte versuche es erneut.', err))
    }
  }
}
</script>

