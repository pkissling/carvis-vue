<template>
  <v-col>
    <v-select
      @input="$emit('input', $event)"
      :value="value"
      :label="label"
      :hint="hint"
      :rules="rules"
      :items="_items"
      dense
      outlined
    ></v-select>
  </v-col>
</template>

<script>
export default {
  props: [
    'value',
    'items',
    'label',
    'hint',
    'required'
  ],
  created() {
    if (this.items) {
      this.items.sort()
    }
  },
  computed: {
    rules () {
      return this.required === '' ? [ v => !!v || 'Pflichtfeld' ] : []
    },
    _items () {
      return this.allowUserInput ? [...this.items, 'Andere' ] : this.items
    }
  }
}
</script>
