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
      />

      <CarDataCard
        id="car-data-card"
        v-model="car"
      />

      <EditCarPreviewCard
        v-if="!readOnly"
        v-model="car.images"
      />

      <ActionsCard
        v-if="!readOnly"
        :car-id="car.id"
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
import carService from '../service/car-service'
import userService from '../service/user-service'
import DeleteModal from '../modals/DeleteModal'
import CarPreviewCard from '../cards/CarPreviewCard'
import EditCarPreviewCard from '../cards/EditCarPreviewCard'
import CarDataCard from '../cards/CarDataCard'
import ActionsCard from '../cards/ActionsCard'

export default {
  components: {
    DeleteModal,
    CarDataCard,
    CarPreviewCard,
    EditCarPreviewCard,
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
      return this.$apollo.loading || this.$auth.loading
    },
    readOnly () {
      if (this.car.id === undefined) {
        return false
      }
      if (this.car.ownerUsername === userService.getUsername()) {
        return false
      }
      return true
    },
    deleteModalSubject () {
      return `${this.car.brand} ${this.car.type}`
    },
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
      carService.deleteCar(this.car)
        .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>

