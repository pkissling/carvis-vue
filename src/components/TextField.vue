<template>
  <v-col>
    <v-text-field
      :value="value"
      :label="label"
      :hint="hint"
      :rules="rules"
      :type="type"
      :suffix="suffix"
      :counter="counter"
      dense
      outlined
      @input="$emit('input', $event)"
    />
  </v-col>
</template>

<script>
export default {
  props: {
    value: {
      type: [ String, Number ],
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    counter: {
      type: Number,
      default: null
    }
  },
  computed: {
    rules () {
      return this.required ? [ v => !!v || 'Pflichtfeld' ] : []
    }
  }
}
</script>

<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
