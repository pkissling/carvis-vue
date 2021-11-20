<template>
  <!-- TODO use a guard to prepolulate -->
  <div v-if="request">
    <v-form
      ref="form"
      v-model="valid"
      :disabled="readOnly"
      @submit.stop.prevent="onSubmit"
    >
      <RequestCarDataCard
        id="request-car-data-card"
        v-model="request"
      />

      <RequestContactDataCard
        id="request-contact-data-card"
        v-model="request"
      />

      <ActionsCard
        v-if="!readOnly"
        :id="request.id"
        @delete="showDeletionModal = true"
      />

      <DeleteModal
        v-if="showDeletionModal"
        :subject="deleteModalSubject"
        @submit="deleteRequest"
        @cancel="showDeletionModal = false"
      />
    </v-form>
  </div>
</template>
<script>
import notificationService from '@/service/notification-service'
import userService from '@/service/user-service'
import DeleteModal from '@/modals/DeleteModal.vue'
import ActionsCard from '@/cards/ActionsCard.vue'
import RequestCarDataCard from '@/cards/RequestCarDataCard.vue'
import RequestContactDataCard from '@/cards/RequestContactDataCard.vue'

export default {
  components: {
    ActionsCard,
    DeleteModal,
    RequestCarDataCard,
    RequestContactDataCard,
  },
  props: {
    request: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      showDeletionModal: false,
      valid: true
    }
  },
  computed: {
    loading () {
      return this.$auth.loading || this.$store.getters['common/isLoading']
    },
    readOnly () {
      if (this.request.id === undefined) {
        return false
      }
      if (this.request.createdBy === userService.getUsername()) {
        return false
      }
      return true
    },
    deleteModalSubject () {
      return `${this.request.brand} ${this.request.type}` // TODO
    },
    canEdit () {
      if (!this.request || !this.request.id) {
        return true
      }

      return this.request.createdBy === userService.getUsername()
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('submit', this.request)
      } else {
        this.$vuetify.goTo('#request-car-data-card') // TODO go to specific item!
      }
    },
    deleteRequest() {
      this.showDeletionModal = false
      this.$store.dispatch('requests/deleteRequest', this.request.id)
        .then(() => notificationService.success('Gesuch erfolgreich gelöscht.'))
        .then(() => this.$router.push({ path: '/requests' }))
        .catch(err => notificationService.error('Fehler beim Löschen des Gesuchs. Bitte versuche es erneut.', err))
    }
  }
}
</script>

