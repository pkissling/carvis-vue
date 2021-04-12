<template>
  <v-container>
    <span class="text-h2">Fahrzeuge</span>
    <v-text-field
      v-model="searchTerm"
      prepend-icon="mdi-magnify"
      placeholder="Porsche Carrera"
      class="my-12"
      outlined
      clearable
    />

    <v-data-table
      :headers="headers"
      :items="_cars"
      :items-per-page="20"
      :loading="loading"
      :mobile-breakpoint="0"
      :search="searchTerm"
      class="elevation-5"
      @click:row="viewCar"
    >
      <template v-slot:item.preview="{ item }">
        <CarThumbnail
          :car-thumbnails="carThumbnails"
          :image-id="item.preview"
        />
      </template>
    </v-data-table>

    <FloatingButton
      :loading="loading"
      @create-clicked="createCar"
    />
  </v-container>
</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import imageService from '../service/image-service'
import FloatingButton from '../components/FloatingButton'
import CarThumbnail from '../components/CarThumbnail'
import { relativeTimeDifference } from '../utilities/time'

export default {
  components: {
    CarThumbnail,
    FloatingButton
  },
  data () {
    return {
      searchTerm: '',
      carThumbnails: [],
      headers: [
        {
          sortable: false,
          value: 'preview'
        },
        {
          text: 'Marke',
          value: 'brand',
        },
        {
          text: 'Typ',
          align: 'start',
          value: 'type',
        },
        {
          text: 'Modellreihe',
          value: 'modelSeries',
        },
        {
          text: 'Modelljahr',
          value: 'modelYear',
        },
        {
          text: 'Außenfarbe',
          value: 'colorExterior',
        },
        {
          text: 'Erstellt durch',
          value: 'ownerName',
        },
        {
          text: 'Zuletzt aktualisiert',
          sortable: false,
          value: 'lastChanged'
        }
      ]
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    },
    _cars () {
      if (!this.cars) {
        return []
      }

      return this.cars
        .map(car => {
          const lastChanged = relativeTimeDifference(car.updatedAt)
          const preview = car.images ? car.images[0] : null
          if (preview && !this.carThumbnails.map(p => p.id).includes(preview)) {
            this.carThumbnails.push( { id: preview, loading: true, src: null })
          }
          return {
            preview,
            lastChanged,
            ...car
          }
        })
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  },
  watch: {
    carThumbnails(carThumbnails) {
      carThumbnails.filter(thumbnail => thumbnail.loading)
        .map(thumbnail => thumbnail.id)
        .map(thumbnailImageId => this.resolveImageUrl(thumbnailImageId))
    }
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/cars/add' })
    },
    async resolveImageUrl (thumbnailImageId) {
      return imageService.fetchImageUrl(thumbnailImageId, 50)
        .then(url => { return { id: thumbnailImageId, src: url, loading: false }})
        .then(thumbnail => this.carThumbnails = [ thumbnail, ...this.carThumbnails.filter(img => img.id !== thumbnail.id)])
    },
  },
  apollo: {
    cars: {
      query: ListCars,
      update: data => data.listCars ? data.listCars.items : [],
      prefetch: true
    }
  }
}
</script>
