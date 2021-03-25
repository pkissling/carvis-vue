<template>
  <v-col>
    <v-textarea
      :value="value"
      :label="label"
      :rules="rules"
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
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
  },
  computed: {
    rules () {
      return this.required === '' ? [ v => !!v || 'Pflichtfeld' ] : []
    }
  }
}
</script>
