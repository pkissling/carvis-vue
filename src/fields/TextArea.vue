<template>
  <v-col>
    <v-textarea
      :value="value"
      :label="label"
      :rules="rules"
      :counter="counter"
      :rows="rows"
      auto-grow
      dense
      outlined
      @input="onInput"
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
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    rows: {
      type: Number,
      default: 5
    },
    counter: {
      type: Number,
      default: null
    }
  },
  computed: {
    rules () {
      const rules = []

      if (this.required) {
        const rule = v => !!v || 'Pflichtfeld'
        rules.push(rule)
      }

      if (this.counter) {
        const rule = v => !v || v.length <= this.counter || `Maximal ${this.counter} Zeichen`
        rules.push(rule)
      }


      return rules
    }
  },
  methods: {
    onInput (input) {
      if (input === '') {
        this.$emit('input', null)
      } else {
        this.$emit('input', input)
      }
    }
  }
}
</script>
