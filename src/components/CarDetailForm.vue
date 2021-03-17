<template>
  <div v-if="this.car">
    <b-form @reset="onReset" @submit.stop.prevent="onSubmit">
      <fieldset :disabled="this.viewOnly">
        <!-- brand -->
        <b-form-group
          label="Marke:"
          label-for="brand"
          description="Eine Beschreibung was hier genau verlangt wird."
        >
          <b-form-input
            v-model="car.brand"
            placeholder="Porsche"
            required
          ></b-form-input>
        </b-form-group>

        <!-- color -->
        <b-form-group
          label="Farbe:"
          label-for="color"
        >
          <b-form-input
            v-model="car.color"
            placeholder="Rostbraun"
            required
          ></b-form-input>
        </b-form-group>

        <!-- optional -->
        <b-form-group
          label="Kilometerstand"
          label-for="optional"
        >
          <b-form-input
            v-model="car.mileage"
            type=number
          ></b-form-input>
        </b-form-group>
      </fieldset>

      <div v-if="!viewOnly">
        <b-button type="submit" :disabled="!canSubmit">Speichern</b-button>
        <b-button type="reset" :disabled="!canReset" variant="light">Zurücksetzen</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  props: [
    'car',
    'viewOnly'
  ],
  computed: {
    canSubmit () {
      return this.car.brand &&
        this.car.color
    },
    canReset () {
      return !this.car.brand ||
        this.car.color ||
        this.car.mileage
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.car)
    },
    onReset() {
      // TODO how to set all childs to null?
      // also consider nested attributes
      this.car.brand = null
      this.car.color = null
      this.car.mileage = null
    }
  }
}
</script>