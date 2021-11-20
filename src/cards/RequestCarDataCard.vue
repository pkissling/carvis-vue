<template>
  <v-card
    class="my-12"
  >
    <template slot="progress">
      <v-progress-linear indeterminate />
    </template>
    <v-card-title class="text-h4 title">
      Fahrzeugdaten
    </v-card-title>

    <v-card-text>
      <v-row>
        <TextField
          v-model="value.brand"
          label="Fahrzeughersteller"
          hint="Beispiel: Porsche, VW, BMW"
          required
        />
        <TextField
          v-model="value.type"
          label="Typ"
          hint="Beispiel: 911, Bus, 5er"
          required
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import TextField from '../fields/TextField.vue'

export default {
  components: {
    TextField
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    kilowatts() {
      return this.value.horsePower ? Math.round(this.value.horsePower * 0.73549875) : null
    }
  },
  methods: {
    kilowattsChanged(kw) {
      if (!kw) {
        this.value.horsePower = null
      }
      this.value.horsePower = Math.round(kw / 0.73549875)
    }
  }
}
</script>

<style scoped>
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}

.title {
  margin-bottom: 16px;
}
</style>