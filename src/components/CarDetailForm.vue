<template>
  <div v-if="car">
    <v-card
      :read-only="readOnly"
      :loading="loading"
      class="my-12"
    >
      <template slot="progress">
        <v-progress-linear indeterminate />
      </template>

      <v-form
        ref="form"
        v-model="valid"
        class="form"
        :disabled="readOnly"
        @submit.stop.prevent="onSubmit"
        @reset="onReset"
      >
        <v-card-text>
          <v-row>
            <TextField
              v-model="car.brand"
              label="Fahrzeughersteller"
              hint="Beispiel: Porsche, VW, BMW"
              required
            />
            <TextField
              v-model="car.type"
              label="Typ"
              hint="Beispiel: 911, Bus, 5er"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.modelSeries"
              label="Modellreihe"
              hint="Beispiel: 964, T2, E34"
              required
            />
            <TextField
              v-model="car.modelYear"
              label="Modelljahr"
              hint="Beispiel: 1990"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.modelDetails"
              label="Modellspezifikation"
              hint="Beispiel: RSR Recreation, Carrera RS, Carrera 4"
              required
            />
            <TextField
              v-model="car.bodyType"
              label="Karosserie"
              hint="Beispiel: Coupe, Targa, Cabrio"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.capacity"
              type="number"
              label="Hubraum"
              hint="Beispiel: 2500"
              suffix="ccm"
              required
            />
            <TextField
              v-model="car.transmission"
              label="Getriebe"
              hint="Beispiel: Automatik, 4Gang, 5Gang"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.horsePower"
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
              v-model="car.colorExterior"
              :items="options.colors"
              label="Außenfarbe"
              required
            />
            <TextField
              v-model="car.colorExteriorManufacturer"
              label="Hersteller Farbbezeichnung"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.colorAndMaterialInterior"
              label="Innenfarbe"
              required
            />
            <Dropdown
              v-model="car.condition"
              :items="options.conditions"
              label="Zustand"
              required
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.countryOfOrigin"
              label="Auslieferungsland"
            />
            <TextField
              v-model="car.mileage"
              label="Laufleistung"
              type="number"
              suffix="km"
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.price"
              label="Preis in Euro"
              type="number"
              suffix="Euro"
              outlined
            />
            <TextField
              v-model="car.vin"
              label="Fahrgestellnummer"
            />
          </v-row>

          <v-row>
            <TextField
              v-model="car.additionalEquipment"
              label="Mehr-Ausstattung"
            />
          </v-row>

          <v-row>
            <v-col>
              <v-combobox
                v-model="car.ads"
                :items="ads"
                multiple
                label="Geschaltete Anzeigen"
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
            <TextField
              v-model="car.shortDescription"
              label="Eine Kurzbeschreibung mit den wichtigsten Merkmalen"
              :counter="100"
              required
            />
          </v-row>

          <v-row>
            <TextArea
              v-model="car.description"
              label="Detailbeschreibung"
              outlined
            />
          </v-row>

          <v-row>
            <v-col>
              <ImageUpload
                v-model="car.images"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-flex v-if="!readOnly">
          <v-divider />
          <v-card-actions class="d-block d-sm-flex">
            <v-btn
              color="primary"
              type="submit"
            >
              <span v-if="car.id">
                Speichern
              </span>
              <span v-else>
                Hinzufügen
              </span>
            </v-btn>
            <v-btn
              depressed
              @click="onReset"
            >
              Zurücksetzen
            </v-btn>

            <v-spacer />

            <v-btn
              v-if="car.id"
              color="error"
              text
              @click="showCarDeletionModal = true"
            >
              Löschen
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-form>
    </v-card>

    <DeleteModal
      v-if="showCarDeletionModal"
      :subject="deleteModalSubject"
      @submit="deleteCar"
      @cancel="showCarDeletionModal = false"
    />
  </div>
</template>
<script>
import carService from '../service/car-service'
import userService from '../service/user-service'
import DeleteModal from '../modals/DeleteModal'
import TextField from './TextField'
import Dropdown from './Dropdown'
import TextArea from './TextArea'
import ImageUpload from './ImageUpload'

export default {
  components: {
    DeleteModal,
    TextField,
    Dropdown,
    TextArea,
    ImageUpload
  },
  props: {
    car: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      images: [],
      showCarDeletionModal: false,
      valid: true,
      ads: [],
      lastInput: null,
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
          "Original",
          "Teilrestauriert",
          "Restauriert",
          "Restaurationsobjekt",
          "Umbau (Backdate)"
        ]
      }
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    },
    readOnly () {
      if (this.car.id === undefined) {
        return false
      }
      if (this.car.ownerUsername === userService.getUsername()) {
        return false
      }
      return true
    },
    deleteModalSubject () {
      return `${this.car.brand} ${this.car.type}`
    },
    kilowatts() {
      return this.car.horsePower ? Math.round(this.car.horsePower * 0.73549875) : null
    }
  },
  watch: {
    'car.ads' () {
      if (this.ads.length === 0 && this.car.ads) {
        this.ads = [...this.car.ads]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('submit', this.car)
      } else {
        this.$vuetify.goTo(0)
      }
    },
    onReset () {
      this.$refs.form.reset()
    },
    deleteCar() {
      this.showCarDeletionModal = false
      carService.deleteCar(this.car)
        .then(() => this.$router.push({ path: '/' }))
    },
    kilowattsChanged(kw) {
      if (!kw) {
        this.car.horsePower = null
      }
      this.car.horsePower = Math.round(kw / 0.73549875)
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

      if (this.lastInput) this.ads = this.ads.filter(ad => ad !== this.lastInput)
      this.lastInput = input
      this.ads.push(input)
    }
  }
}
</script>

<style scoped>
.form {
  padding-top: 20px;
}
.col {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>