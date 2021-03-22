<template>
  <div v-if="this.car">
    <v-form
      @submit.stop.prevent="onSubmit"
      @reset="onReset"
      :disabled="this.readOnly"
      ref="form"
    >
      <v-row>
        <v-col>
          <v-text-field
            v-model="car.brand"
            label="Fahrzeughersteller"
            placeholder="Porsche, VW, BMW"
            required
          ></v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="car.type"
            label="Typ"
            placeholder="911, Bus, 5er"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="car.modelSeries"
            label="Modellreihe"
            placeholder="964, T2, E34"
            required
          ></v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="car.modelYear"
            type=number
            label="Modelljahr"
            placeholder="1990"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="car.modelDetails"
        label="Modellspezifikation"
        placeholder="Für eigene Eingaben. z.B. RSR Recreation oder Carrera RS oder Carrera 4"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.bodyType"
        label="Karosserie"
        placeholder="Coupe, Targa, Cabrio"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.capacity"
        label="Hubraum in ccm"
        placeholder="3.6 turbo, 2.0 Vergaser, 2.5TD"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.horsePower"
        label="Leistung in PS"
        placeholder="150"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.transmission"
        label="Getriebe"
        placeholder="Automatik, 4Gang, 5Gang"
        required
      ></v-text-field>

      <v-text-field
        v-model="car.countryOfOrigin"
        label="Auslieferungsland"
      ></v-text-field>

      <v-row>
        <v-col>
          <v-select
            v-model="car.colorExterior"
            :items="options.colors"
            label="Außenfarbe"
          ></v-select>
        </v-col>

        <v-col>
          <v-select
            v-model="car.colorAndMaterialInterior"
            :items="options.colors"
            label="Innenfarbe"
          ></v-select>
        </v-col>

        <v-col>
          <v-text-field
            v-model="car.colorExteriorManufacturer"
            label="Hersteller Farbbezeichnung"
          ></v-text-field>
        </v-col>
      </v-row>





      <v-text-field
        v-model="car.vin"
        label="Fahrgestellnummer"
      ></v-text-field>

      <v-text-field
        v-model="car.mileage"
        label="Laufleistung in KM"
      ></v-text-field>

      <v-text-field
        v-model="car.additionalEquipment"
        label="Mehr-Ausstattung"
      ></v-text-field>

      <v-select
        v-model="car.condition"
        :items="options.conditions"
        label="Zustand"
        required
      ></v-select>

      <v-text-field
        v-model="car.shortDescription"
        label="Besonderheit / Highlights"
        placeholder="Eine Kurzbeschreibung mit den wichtigsten Merkmalen"
      ></v-text-field>

      <v-textarea
        v-model="car.description"
        label="Sonstiges / Beschreibung"
        placeholder="Detailbeschreibung"
      ></v-textarea>

      <v-text-field
        v-model="car.price"
        label="Preis in Euro"
        type=float
        required
      ></v-text-field>

      <div v-if="!readOnly">
        <v-btn
          class="mr-4"
          type="submit"
          color="primary"
          :disabled="!canSubmit"
        >
          Hinzufügen
        </v-btn>
        <v-btn
          class="mr-4"
          type="reset"
        >
          Zurücksetzen
        </v-btn>
        <v-btn
          class="mr-4"
          color="red"
          @click="triggerDeleteCar"
        >
          Fahrzeug löschen
        </v-btn>
      </div>

      <DeleteModal
        v-if="showCarDeletionPopup"
        :subject="car.brand"
        @delete="deleteCar"
        @cancel="showCarDeletionPopup = false"
      />
    </v-form>
  </div>
</template>
<script>
import carService from '../service/car-service'
import DeleteModal from '../modals/DeleteModal'

export default {
  components: {
    DeleteModal
  },
  props: [
    'car',
    'readOnly'
  ],
  data: () => {
    return {
      showCarDeletionPopup: false,
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
          "Braun",
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
  methods: {
    onSubmit() {
      this.$emit('submit', this.car)
    },
    onReset () {
      // TODO how to set all childs to null?
      // also consider nested attributes
      this.car.brand = null
      this.car.color = null
      this.car.mileage = null
    },
    triggerDeleteCar() {
      this.showCarDeletionPopup = true
    },
    deleteCar() {
      this.showCarDeletionPopup = false
      carService.deleteCar(this.car)
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  computed: {
    canSubmit () {
      return this.car.brand && this.car.type
    }
  }
}
</script>