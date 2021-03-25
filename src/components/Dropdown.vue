<template>
  <v-col>
    <v-select
      :value="value"
      :label="label"
      :hint="hint"
      :rules="rules"
      :items="_items"
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
    }
  },
  computed: {
    rules () {
      return this.required === '' ? [ v => !!v || 'Pflichtfeld' ] : []
    },
    _items () {
      return this.allowUserInput ? [...this.items, 'Andere' ] : this.items
    }
  },
  created() {
    if (this.items) {
      this.items.sort()
    }
  }
}
</script>
