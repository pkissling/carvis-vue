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
        <v-avatar color="grey lighten-1">
          <v-img
            v-if="item.preview"
            :src="previewImages.find(img => img.id === item.preview)"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                />
              </v-row>
            </template>
          </v-img>
          <v-icon v-else
                  color="primary"
          >
            mdi-car
          </v-icon>
        </v-avatar>
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
import { relativeTimeDifference } from '../utilities/time'

export default {
  components: {
    FloatingButton
  },
  data () {
    return {
      searchTerm: '',
      previewImages: [],
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
          if (preview && !this.previewImages.map(p => p.id).includes(preview)) {
            this.previewImages.push( { id: preview, loading: true, src: null })
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
    previewImages(previewImages) {
      previewImages.filter(preview => preview.loading)
        .map(preview => preview.id)
        .map(previewImageId => this.resolveImageUrl(previewImageId))
    }
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/cars/add' })
    },
    async resolveImageUrl (imageId) {
      return imageService.fetchImageUrl(imageId, 50)
        .then(url => { return { id: imageId, src: url, loading: false }})
        .then(resolvedImage => this.previewImages = [ resolvedImage, ...this.previewImages.filter(img => img.id !== resolvedImage.id)])
    },
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars ? data.listCars.items : [],
      prefetch: true
    }
  }
}
</script>
