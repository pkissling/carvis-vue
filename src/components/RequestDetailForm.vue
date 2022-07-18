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
        :loading="saveLoading"
        @delete="openDeleteRequestModal"
      />
    </v-form>
  </div>
</template>

<script lang="ts">
import ActionsCard from '@/components/cards/ActionsCard.vue'
import RequestCarDataCard from '@/components/cards/RequestCarDataCard.vue'
import RequestContactDataCard from '@/components/cards/RequestContactDataCard.vue'
import { Component, Vue, Prop} from 'vue-property-decorator'
import { userStore, modalsStore } from '@/store'
import OwnerCaption from '@/components/OwnerCaption.vue'

@Component({ components: { ActionsCard, RequestCarDataCard, RequestContactDataCard, OwnerCaption }})
export default class RequestDetailForm extends Vue {
  @Prop({ required: true })
  request!: RequestDto

  @Prop({ required: true })
  saveRequestFunction!: (request: RequestDto) => Promise<void>

  showDeletionModal = false
  valid = true
  saveLoading = false

  get canEdit(): boolean {
    if (!this.request || !this.request.id) {
      return true
    }

    return userStore.isAdmin || this.request?.createdBy === userStore.getUserId
  }

  async onSubmit(): Promise<void> {
    const form = (this.$refs.form as Vue & { validate: () => boolean })
    form.validate()
    if (!this.valid) {
      this.$vuetify.goTo('#request-car-data-card') // TODO go to specific item!
      return
    }

    try {
      this.saveLoading = true
      await this.saveRequestFunction(this.request)
     } finally {
      this.saveLoading = false
     }
  }

  async openDeleteRequestModal(): Promise<void> {
    await modalsStore.open({ name: 'DeleteRequestModal', context: this.request })
  }
}
</script>
