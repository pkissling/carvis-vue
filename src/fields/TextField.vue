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
      @input="onInput"
      @change="onChange"
    />
  </v-col>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
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
    },
    type: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    counter: {
      type: Number,
      default: null
    }
  },
  computed: {
    rules() {
      return this.required ? [v => !!v || 'Pflichtfeld'] : []
    }
  },
  methods: {
    onInput(input) {
      if (input === '') {
        this.$emit('input', null)
      } else {
        this.$emit('input', input)
      }
    },
    onChange(input) {
      this.$emit('change', input)
    }
  }
}
</script>

<style scoped>
/* Hides arrows next to numeric fields to increase / decrease values */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
