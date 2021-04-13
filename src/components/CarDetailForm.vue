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
        v-model="car"
      />

      <ImageUploadCard
        v-model="car.images"
      />

      <ActionsCard
        :car-id="car.id"
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
import CarPreviewCard from './CarPreviewCard'
import ImageUploadCard from './ImageUploadCard'
import CarDataCard from './CarDataCard'
import ActionsCard from './ActionsCard'

export default {
  components: {
    DeleteModal,
    CarDataCard,
    CarPreviewCard,
    ImageUploadCard,
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
        this.$vuetify.goTo(0)
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

