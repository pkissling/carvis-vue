<template>
  <Page title="Gesuch hinzufügen">
    <RequestDetailForm
      :request="request"
      @submit="createRequest"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import { requestsStore, notificationsStore } from '@/store'

export default {
  components: {
    RequestDetailForm,
    Page
  },
  data () {
    return {
      request: {
        contactDetails: {
        }
      }
    }
  },
  methods: {
    createRequest(request) {
      requestsStore.createRequest(request)
        .then(() => this.$router.push({ path: '/requests' }))
        .then(() => notificationsStore.success('Gesuch erfolgreich erstellt.'))
        .catch(err => notificationsStore.error({ message: 'Fehler beim Erstellen des Gesuches. Bitte versuche es erneut.', err }))
    }
  }
}
</script>
