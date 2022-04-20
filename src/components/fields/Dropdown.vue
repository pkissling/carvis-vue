<template>
  <v-col>
    <v-autocomplete
      :value="value"
      :label="label"
      :hint="hint"
      :rules="rules"
      :items="items"
      dense
      outlined
      auto-select-first
      @input="$emit('input', $event)"
    />
  </v-col>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rules() {
      return this.required ? [v => !!v || 'Pflichtfeld'] : []
    }
  }
}
</script>
