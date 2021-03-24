<template>
  <v-col>
    <v-textarea
      @input="$emit('input', $event)"
      :value="value"
      :label="label"
      :rules="rules"
      dense
      outlined
    ></v-textarea>
  </v-col>
</template>

<script>
export default {
  props: [
    'value',
    'label',
    'required',
  ],
  computed: {
    rules () {
      return this.required === '' ? [ v => !!v || 'Pflichtfeld' ] : []
    }
  }
}
</script>
