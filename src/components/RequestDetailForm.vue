<template>
  <div v-if="request">
    <OwnerCaption
      :owner="request.ownerName"
      :created-at="request.createdAt"
      :updated-at="request.updatedAt"
      :created-by="request.createdBy"
    />

    <v-form
      ref="form"
      v-model="valid"
      :disabled="!canEdit"
      @submit.stop.prevent="onSubmit"
    >
      <RequestCarDataCard
        id="request-car-data-card"
        v-model="request"
      />

      <RequestContactDataCard
        v-if="canEdit"
        id="request-contact-data-card"
        v-model="request"
      />

      <ActionsCard
        v-if="canEdit"
        :is-new-item="!request.id"
        :show-delete="true"
        @delete="showDeletionModal = true"
      />

      <DeleteModal
        v-if="showDeletionModal"
        :subject="deleteModalSubject"
        :loading="loading"
        @submit="deleteRequest"
        @cancel="showDeletionModal = false"
      />
    </v-form>
  </div>
</template>

<script lang="ts">
import DeleteModal from '@/components/modals/DeleteModal.vue'
import ActionsCard from '@/components/cards/ActionsCard.vue'
import RequestCarDataCard from '@/components/cards/RequestCarDataCard.vue'
import RequestContactDataCard from '@/components/cards/RequestContactDataCard.vue'
import { Component, Vue, Prop} from 'vue-property-decorator'
import { requestsStore, notificationsStore, userStore } from '@/store'
import OwnerCaption from '@/components/OwnerCaption.vue'

@Component({ components: { DeleteModal, ActionsCard, RequestCarDataCard, RequestContactDataCard, OwnerCaption }})
export default class RequestDetailForm extends Vue {
  @Prop({ required: true })
  request!: RequestDto

  showDeletionModal = false
  valid = true
  loading = false

  get deleteModalSubject(): string {
    return `${this.request.brand} ${this.request.type}`
  }

  get canEdit(): boolean {
    if (!this.request || !this.request.id) {
      return true
    }

    return userStore.isAdmin || this.request?.createdBy === userStore.getUserId
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
      this.loading = true
      await requestsStore.deleteRequest(this.request.id)
      await notificationsStore.success('Gesuch erfolgreich gelöscht.')
      await this.$router.push({ path: '/requests' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Gesuchs. Bitte versuche es erneut.', err })
    } finally {
      this.showDeletionModal = false
      this.loading = false
    }
  }
}
</script>
