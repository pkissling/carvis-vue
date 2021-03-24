<template>
  <v-col>
    <v-text-field
      @input="$emit('input', $event)"
      :value="value"
      :label="label"
      :hint="hint"
      :rules="rules"
      :type="type"
      :suffix="suffix"
      :counter="counter"
      dense
      outlined
    ></v-text-field>
  </v-col>
</template>

<script>
export default {
  props: [
    'value',
    'label',
    'hint',
    'required',
    'type',
    'suffix',
    'counter'
  ],
  computed: {
    rules () {
      return this.required === '' ? [ v => !!v || 'Pflichtfeld' ] : []
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
