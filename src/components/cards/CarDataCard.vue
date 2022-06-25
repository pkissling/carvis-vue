<template>
  <CarvisCard class="my-12">
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
          required
        />
        <TextField
          v-model="value.modelYear"
          label="Modelljahr"
          hint="Beispiel: 1990"
          required
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.modelDetails"
          label="Modellspezifikation"
          hint="Beispiel: RSR Recreation, Carrera RS, Carrera 4"
          required
        />
        <TextField
          v-model="value.bodyType"
          label="Karosserie"
          hint="Beispiel: Coupe, Targa, Cabrio"
          required
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.capacity"
          type="number"
          label="Hubraum"
          hint="Beispiel: 2500"
          suffix="ccm"
          required
        />
        <TextField
          v-model="value.transmission"
          label="Getriebe"
          hint="Beispiel: Automatik, 4Gang, 5Gang"
          required
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.horsePower"
          type="number"
          label="Leistung"
          suffix="PS"
          required
        />
        <TextField
          :value="kilowatts"
          type="number"
          label="Leistung"
          suffix="KW"
          required
          @input="kilowattsChanged"
        />
      </v-row>

      <v-row>
        <Dropdown
          v-model="value.colorExterior"
          :items="options.colors"
          label="Außenfarbe"
          required
        />
        <TextField
          v-model="value.colorExteriorManufacturer"
          label="Hersteller Farbbezeichnung"
          required
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.colorAndMaterialInterior"
          label="Innenfarbe"
          required
        />
        <Dropdown
          v-model="value.condition"
          :items="options.conditions"
          label="Zustand"
          required
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
          @change="onMileageChanged"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.price"
          label="Preis in Euro"
          type="number"
          suffix="Euro"
          outlined
        />
        <TextField
          v-model="value.vin"
          label="Fahrgestellnummer"
        />
      </v-row>

      <v-row>
        <TextField
          v-model="value.additionalEquipment"
          label="Mehr-Ausstattung"
        />
      </v-row>

      <v-row>
        <v-col>
          <v-combobox
            v-model="value.ads"
            :items="ads"
            multiple
            label="Inserate"
            chips
            outlined
            clearable
            deletable-chips
            @change="onAdsChange"
            @update:search-input="onAdsSearchInput"
          />
        </v-col>
      </v-row>
      <v-row>
        <TextArea
          v-model="value.shortDescription"
          label="Eine Kurzbeschreibung mit den wichtigsten Merkmalen"
          :counter="100"
          :rows="1"
          required
        />
      </v-row>

      <v-row>
        <TextArea
          v-model="value.description"
          label="Detailbeschreibung"
        />
      </v-row>
    </v-card-text>
  </CarvisCard>
</template>

<script>
import TextField from '@/components/fields/TextField.vue'
import Dropdown from '@/components/fields/Dropdown.vue'
import TextArea from '@/components/fields/TextArea.vue'

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
  data() {
    return {
      ads: [],
      lastInput: null,
      options: {
        colors: [
          'Beige',
          'Blau',
          'Braun',
          'Gelb',
          'Gold',
          'Grau',
          'Grün',
          'Orange',
          'Rot',
          'Schwarz',
          'Silber',
          'Violett',
          'Weiß',
          'Andere'
        ],
        conditions: [
          'ursprünglich Original',
          'Patiniert',
          'Überwiegend original',
          'Teilrestauriert',
          'Restauriert',
          'Restaurationsobjekt',
          'Umbau / Backdate'
        ]
      }
    }
  },
  computed: {
    kilowatts() {
      return this.value.horsePower
        ? Math.round(this.value.horsePower * 0.73549875)
        : null
    }
  },
  watch: {
    'value.ads'() {
      if (this.ads.length === 0 && this.value.ads) {
        this.ads = [...this.value.ads]
      }
    }
  },
  methods: {
    kilowattsChanged(kw) {
      if (!kw) {
        this.value.horsePower = null
      }
      this.value.horsePower = Math.round(kw / 0.73549875)
    },
    onAdsChange(ad) {
      const newAd = ad.find(i => !this.ads.includes(i))
      if (newAd) {
        this.ads.push(newAd)
      }
    },
    onAdsSearchInput(input) {
      if (!this.ads || !input) {
        return
      }

      if (this.lastInput)
        this.ads = this.ads.filter(ad => ad !== this.lastInput)
      this.lastInput = input
      this.ads.push(input)
    },
    onMileageChanged(input) {
      this.value.mileage = isNaN(parseInt(input)) ? null : parseInt(input)
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
