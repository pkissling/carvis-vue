<template>
  <Page title="Gesuche">
    <OverviewTable
      search-placeholder-text="Porsche Carrera"
      :headers="headers"
      :items="requests"
      :loading="loading"
      @row-clicked="viewRequest"
      @create-clicked="createRequest"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { relativeTimeDifference } from '@/utilities/time'
import { commonStore, requestsStore, notificationsStore } from '@/store'

export default {
  components: {
    OverviewTable,
    Page
  },
  data() {
    return {
      headers: [
        {
          text: 'Marke',
          value: 'brand'
        },
        {
          text: 'Typ',
          value: 'type'
        },
        {
          text: 'Karosserie',
          value: 'bodyType'
        },
        {
          text: 'Modelljahr',
          value: 'modelYear'
        },
        {
          text: 'Erstellt durch',
          value: 'ownerName'
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
    loading() {
      return this.$auth.loading || commonStore.isLoading
    },
    requests() {
      return requestsStore.requests.map(request => {
        const lastChanged = relativeTimeDifference(request.updatedAt)
        return {
          lastChanged,
          ...request
        }
      })
    }
  },
  created() {
    requestsStore.fetchAllRequests().catch(err =>
      notificationsStore.error({
        message: 'Fehler beim Laden der Gesuche. Bitte versuche es erneut.',
        err
      })
    )
  },
  methods: {
    viewRequest(request) {
      this.$router.push({ path: `/requests/${request.id}` })
    },
    createRequest() {
      this.$router.push({ path: '/requests/add' })
    }
  }
}
</script>
