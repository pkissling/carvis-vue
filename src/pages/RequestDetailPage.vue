<template>
  <WaitingLayer v-if="loading" />
  <Page
    v-else
    :title="title"
  >
    <RequestDetailForm
      :request="request"
      @submit="updateRequest"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import { userStore } from '@/store'
import router from '@/router'
import { requestsStore, notificationsStore } from '@/store'

export default {
  components: {
    RequestDetailForm,
    WaitingLayer,
    Page
  },
  props: {
    requestId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      loading: false,
      request: null
    }
  },
  computed: {
    canEdit () {
      return userStore.isAdmin || this.request?.createdBy === userStore.getUsername
    },
    title () {
      return this.canEdit ? 'Gesuch bearbeiten' : 'Gesuch anzeigen'
    }
  },
  methods: {
    updateRequest (request) {
      requestsStore.updateRequest(request)
        .then(() => this.$router.push({ path: '/requests' }))
        .then(() => notificationsStore.success('Gesuch erfolgreich bearbeitet.'))
        .catch(err => notificationsStore.error('Fehler beim Bearbeiten des Gesuchs. Bitte versuche es erneut.', err))
    }
  },
  async beforeRouteEnter (to, from, next) {
     next(vm => {
      vm.loading = true
      const requestId = to.params.requestId
      requestsStore.fetchRequest(requestId)
        .then(() => requestsStore.requests.find(req => req.id === requestId))
        .then(request => vm.request = request)
        .catch(err => {
          notificationsStore.error({ message: 'Fehler beim Laden des Gesuchs. Bitte versuche es erneut.', err })
          // this.$router is not available
          router.push({ name: 'NotFound' })
        })
        .finally(() => vm.loading = false)
    })
  }
}
</script>
