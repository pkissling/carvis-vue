<template>
  <div v-if="request">
    <v-form
      ref="form"
      v-model="valid"
      :disabled="!canEdit"
      @submit.stop.prevent="onSubmit"
    >
      <RequestCarDataCard id="request-car-data-card"
                          v-model="request"
      />

      <RequestContactDataCard
        v-if="canEdit"
        id="request-contact-data-card"
        v-model="request"
      />

      <ActionsCard
        v-if="canEdit"
        :is-new-item="request.id"
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

<script lang="ts">
import DeleteModal from '@/components/modals/DeleteModal.vue'
import ActionsCard from '@/cards/ActionsCard.vue'
import RequestCarDataCard from '@/cards/RequestCarDataCard.vue'
import RequestContactDataCard from '@/cards/RequestContactDataCard.vue'
import { Component, Vue, Prop} from 'vue-property-decorator'
import { commonStore, requestsStore, notificationsStore, userStore } from '@/store'

@Component({ components: { DeleteModal, ActionsCard, RequestCarDataCard, RequestContactDataCard }})


export default class RequestDetailForm extends Vue {
  @Prop({ required: true })
  request!: RequestDto

  showDeletionModal = false
  valid = true

  get loading(): boolean {
    return this.$auth.loading || commonStore.isLoading
  }

  get deleteModalSubject(): string {
    return `${this.request.brand} ${this.request.type}`
  }

  get canEdit(): boolean {
    if (!this.request || !this.request.id) {
      return true
    }

    return (
      userStore.isAdmin || this.request?.createdBy === userStore.getUserId
    )
  }

  onSubmit(): void {
    const form = (this.$refs.form as Vue & { validate: () => boolean })
    form.validate()
    if (this.valid) {
      this.$emit('submit', this.request)
    } else {
      this.$vuetify.goTo('#request-car-data-card') // TODO go to specific item!
    }
  }

  async deleteRequest(): Promise<void> {
    try {
      await requestsStore.deleteRequest(this.request.id)
      await notificationsStore.success('Gesuch erfolgreich gelöscht.')
      await this.$router.push({ path: '/requests' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Gesuchs. Bitte versuche es erneut.', err })
    } finally {
      this.showDeletionModal = false
    }
  }
}
</script>
