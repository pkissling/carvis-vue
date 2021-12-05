<template>
  <WaitingLayer v-if="loading" />
  <div v-else>
    <span class="text-h2">{{ title }}</span>
    <RequestDetailForm
      :request="request"
      @submit="updateRequest"
    />
  </div>
</template>

<script>
import notificationService from '@/service/notification-service'
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import userService from '@/service/user-service'
import router from '@/router'
import store from '@/store'

export default {
  components: {
    RequestDetailForm,
    WaitingLayer
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
      return userService.isAdmin() || this.request?.createdBy === userService.getUsername()
    },
    title () {
      return this.canEdit ? 'Gesuch bearbeiten' : 'Gesuch anzeigen'
    }
  },
  methods: {
    updateRequest (request) {
      this.$store.dispatch('requests/updateRequest', request)
        .then(() => this.$router.push({ path: '/requests' }))
        .then(() => notificationService.success('Gesuch erfolgreich bearbeitet.'))
        .catch(err => notificationService.error('Fehler beim Bearbeiten des Gesuchs. Bitte versuche es erneut.', err))
    }
  },
  async beforeRouteEnter (to, from, next) {
     next(vm => {
      vm.loading = true
      const requestId = to.params.requestId
      store.dispatch('requests/fetchRequest', requestId)
        .then(() => store.getters['requests/oneRequest'](requestId))
        .then(request => vm.request = request)
        .catch(err => {
          notificationService.error('Fehler beim Laden des Gesuchs. Bitte versuche es erneut.', err)
          // this.$router is not available
          router.push({ name: 'NotFound' })
        })
        .finally(() => vm.loading = false)
    })
  }
}
</script>
