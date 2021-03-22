<template>
  <div v-if="this.car">
    <v-form
      @submit.stop.prevent="onSubmit"
      @reset="onReset"
      :disabled="this.readOnly"
      ref="form"
    >
      <v-text-field
        v-model="car.brand"
        label="Marke"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.color"
        label="Farbe"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.mileage"
        type=number
        label="Kilometerstand"
      ></v-text-field>

      <div v-if="!readOnly">
        <v-btn
          class="mr-4"
          type="submit"
          color="primary"
          :disabled="!canSubmit"
        >
          Hinzufügen
        </v-btn>
        <v-btn
          class="mr-4"
          type="reset"
        >
          Zurücksetzen
        </v-btn>
        <v-btn
          class="mr-4"
          color="red"
          @click="triggerDeleteCar"
        >
          Fahrzeug löschen
        </v-btn>
      </div>

      <DeleteModal
        v-if="showCarDeletionPopup"
        :subject="car.brand"
        @delete="deleteCar"
        @cancel="showCarDeletionPopup = false"
      />
    </v-form>
  </div>
</template>
<script>
import carService from '../service/car-service'
import DeleteModal from '../modals/DeleteModal'

export default {
  components: {
    DeleteModal
  },
  props: [
    'car',
    'readOnly'
  ],
  data: () => {
    return {
      showCarDeletionPopup: false
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.car)
    },
    onReset () {
      // TODO how to set all childs to null?
      // also consider nested attributes
      this.car.brand = null
      this.car.color = null
      this.car.mileage = null
    },
    triggerDeleteCar() {
      this.showCarDeletionPopup = true
    },
    deleteCar() {
      this.showCarDeletionPopup = false
      carService.deleteCar(this.car)
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  computed: {
    canSubmit () {
      return this.car.brand && this.car.color
    }
  }
}
</script>