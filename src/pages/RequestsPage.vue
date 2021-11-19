<template>
  <v-container>
    <OverviewTable
      title="Gesuche"
      search-placeholder-text="TODO"
      :headers="headers"
      :items="requests"
      :loading="loading"
      @row-clicked="viewRequest"
      @create-clicked="createRequest"
    />
  </v-container>
</template>

<script>
import notificationService from '../service/notification-service'
import OverviewTable from '../components/OverviewTable.vue'

export default {
  components: {
    OverviewTable
  },
  data () {
    return {
      searchTerm: '',
      headers: [
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
      return this.$auth.loading || this.$store.getters['common/isLoading']
    },
    requests () {
      return this.$store.getters['requests/allRequests']
    }
  },
  created () {
    this.$store.dispatch('requests/fetchAllRequests')
      .catch(err => notificationService.error('Fehler beim Lesen der Gesuche. Bitte versuche es erneut.', err))
  },
  methods: {
    viewRequest (request) {
      this.$router.push({ path: `/requests/${request.id}`})
    },
    createRequest () {
      this.$router.push({ path: '/requests/add' })
    }
  }
}
</script>
