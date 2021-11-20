<template>
  <v-container>
    <span class="text-h2">Gesuch hinzufügen</span>
    <RequestDetailForm
      :request="request"
      @submit="createRequest"
    />
  </v-container>
</template>

<script>
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import notificationService from '@/service/notification-service'

export default {
  components: {
    RequestDetailForm
  },
  data () {
    return {
      request: {}
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
