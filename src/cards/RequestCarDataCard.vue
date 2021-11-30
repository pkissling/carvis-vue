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

      <v-row>
        <TextField
          v-model="value.modelSeries"
          label="Modellreihe"
          hint="Beispiel: 964, T2, E34"
        />
        <TextField
          v-model="value.modelYear"
          label="Modelljahr"
          hint="Beispiel: 1990"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.modelDetails"
          label="Modellspezifikation"
          hint="Beispiel: RSR Recreation, Carrera RS, Carrera 4"
        />
        <TextField
          v-model="value.bodyType"
          label="Karosserie"
          hint="Beispiel: Coupe, Targa, Cabrio"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.capacity"
          type="number"
          label="Hubraum"
          hint="Beispiel: 2500"
          suffix="ccm"
        />
        <TextField
          v-model="value.transmission"
          label="Getriebe"
          hint="Beispiel: Automatik, 4Gang, 5Gang"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.horsePower"
          type="number"
          label="Leistung"
          suffix="PS"
        />
        <TextField
          :value="kilowatts"
          type="number"
          label="Leistung"
          suffix="KW"
          @input="kilowattsChanged"
        />
      </v-row>

      <v-row>
        <Dropdown
          v-model="value.colorExterior"
          :items="options.colors"
          label="Außenfarbe"
        />
        <TextField
          v-model="value.colorExteriorManufacturer"
          label="Hersteller Farbbezeichnung"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.colorAndMaterialInterior"
          label="Innenfarbe"
        />
        <Dropdown
          v-model="value.condition"
          :items="options.conditions"
          label="Zustand"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.countryOfOrigin"
          label="Auslieferungsland"
        />
        <TextField
          v-model="value.mileage"
          label="Laufleistung"
          type="number"
          suffix="km"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.budget"
          label="Verfügbares Budget"
          type="number"
          suffix="€"
        />
        <TextField
          v-model="value.additionalEquipment"
          label="Mehr-Ausstattung"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.highlights"
          label="Besonderheiten / Highlights"
        />
        <TextField
          v-model="value.vision"
          label="Ziel / Vision"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.mustHaves"
          label="Must-Haves"
        />
        <TextField
          v-model="value.noGos"
          label="No-Gos"
        />
      </v-row>

      <v-row>
        <TextArea
          v-model="value.description"
          label="Detailbeschreibung"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import TextField from '@/fields/TextField.vue'
import Dropdown from '@/fields/Dropdown.vue'
import TextArea from '@/fields/TextArea.vue'

export default {
  components: {
    TextField,
    Dropdown,
    TextArea
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
       options: {
        colors: [
          "Beige",
          "Blau",
          "Braun",
          "Gelb",
          "Gold",
          "Grau",
          "Grün",
          "Orange",
          "Rot",
          "Schwarz",
          "Silber",
          "Violett",
          "Weiß",
          "Andere"
        ],
        conditions: [
          "ursprünglich Original",
          "Patiniert",
          "Überwiegend original",
          "Teilrestauriert",
          "Restauriert",
          "Restaurationsobjekt",
          "Umbau / Backdate"
        ]
      }
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