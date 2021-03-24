<template>
  <div v-if="this.car">
    <v-card
      :readOnly="readOnly"
      :loading="loading"
      class="my-12"
    >
      <template slot="progress">
        <v-progress-linear indeterminate
        ></v-progress-linear>
      </template>

      <v-form
        class="form"
        ref="form"
        @submit.stop.prevent="onSubmit"
        @reset="onReset"
        v-model="valid"
        :disabled="readOnly"
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
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.modelSeries"
              label="Modellreihe"
              hint="Beispiel: 964, T2, E34"
              required
            ></TextField>
            <TextField
              v-model="car.modelYear"
              label="Modelljahr"
              hint="Beispiel: 1990"
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.modelDetails"
              label="Modellspezifikation"
              hint="Beispiel: RSR Recreation, Carrera RS, Carrera 4"
              required
            ></TextField>
            <TextField
              v-model="car.bodyType"
              label="Karosserie"
              hint="Beispiel: Coupe, Targa, Cabrio"
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.capacity"
              type=number
              label="Hubraum"
              hint="Beispiel: 2500"
              suffix="ccm"
              required
            ></TextField>
            <TextField
              v-model="car.transmission"
              label="Getriebe"
              hint="Beispiel: Automatik, 4Gang, 5Gang"
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.horsePower"
              type=number
              label="Leistung in PS"
              suffix="PS"
              @input="psChanged"
              required
            ></TextField>
            <TextField
              v-model="kw"
              type=number
              label="Leistung in KW"
              suffix="KW"
              @input="kwChanged"
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.countryOfOrigin"
              label="Auslieferungsland"
            ></TextField>
            <TextField
              v-model="car.mileage"
              label="Laufleistung"
              type=number
              suffix="km"
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.colorExterior"
              label="Außenfarbe"
              required
            ></TextField>
            <TextField
              v-model="car.colorExteriorManufacturer"
              label="Hersteller Farbbezeichnung"
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.colorAndMaterialInterior"
              label="Innenfarbe"
              required
            ></TextField>
            <TextField
              v-model="car.vin"
              label="Fahrgestellnummer"
            ></TextField>
          </v-row>

          <v-row>
            <TextField
              v-model="car.additionalEquipment"
              label="Mehr-Ausstattung"
            ></TextField>
            <Dropdown
              :items="options.conditions"
              v-model="car.condition"
              label="Zustand"
              required
            ></Dropdown>
          </v-row>

          <v-row>
            <TextField
              v-model="car.price"
              label="Preis in Euro"
              type=number
              suffix="Euro"
              required
              outlined
            ></TextField>
            <v-col></v-col>
          </v-row>

          <v-row>
            <TextField
              v-model="car.shortDescription"
              label="Eine Kurzbeschreibung mit den wichtigsten Merkmalen"
              counter=100
              required
            ></TextField>
          </v-row>

          <v-row>
            <TextArea
              v-model="car.description"
              label="Detailbeschreibung"
              outlined
            ></TextArea>
          </v-row>
        </v-card-text>

        <div v-if="!readOnly">
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="primary"
              type=submit
            >
              <span v-if="car.id">
                Fahrzeug speichern
              </span>
              <span v-else>
                Fahrzeug hinzufügen
              </span>
            </v-btn>
            <v-btn @click="onReset">
              Formular zurücksetzen
            </v-btn>
            <v-btn
              v-if="car.id"
              @click="showCarDeletionModal = true"
              color="error"
            >
              Fahrzeug löschen
            </v-btn>
          </v-card-actions>
        </div>
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
import DeleteModal from '../modals/DeleteModal'
import TextField from './TextField'
import Dropdown from './Dropdown'
import TextArea from './TextArea'

export default {
  components: {
    DeleteModal,
    TextField,
    Dropdown,
    TextArea
  },
  props: [
    'car'
  ],
  data: () => {
    return {
      showCarDeletionModal: false,
      valid: true,
      kw: null,
      options: {
        colors: [
          "Weiß",
          "Schwarz",
          "Silber",
          "Grau",
          "Rot",
          "Grün",
          "Blau",
          "Violett",
          "Gelb",
          "Gold",
          "Orange",
          "Beige",
          "Braun"
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
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('submit', this.car)
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
    psChanged(ps) {
      if (!ps) {
        return
      }
      this.kw = Math.round(ps * 0.73549875)
    },
    kwChanged(kw) {
      if (!kw) {
        this.car.horsePower = null
      }
      this.car.horsePower = Math.round(kw / 0.73549875)
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
      if (this.car.ownerUsername === this.$auth.user.sub) {
        return false
      }
      return true
    },
    deleteModalSubject () {
      return `${this.car.brand} ${this.car.type}`
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