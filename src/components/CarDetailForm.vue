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
        <v-btn type="reset">
          Zurücksetzen
        </v-btn>
        </div>
    </v-form>
  </div>
</template>
<script>
export default {
  props: [
    'car',
    'readOnly'
  ],
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
    }
  },
  computed: {
    canSubmit () {
      return this.car.brand && this.car.color
    }
  }
}
</script>