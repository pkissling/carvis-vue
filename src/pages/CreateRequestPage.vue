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
import notificationService from '@/service/notification-service'

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
      this.$store.dispatch('requests/createRequest', request)
        .then(() => this.$router.push({ path: '/requests' }))
        .then(() => notificationService.success('Gesuch erfolgreich erstellt.'))
        .catch(err => notificationService.error('Fehler beim Erstellen des Gesuches. Bitte versuche es erneut.', err))
    }
  }
}
</script>
