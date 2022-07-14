<template>
  <Page title="Geteilte Links">
    <v-data-table
      :headers="headers"
      :items-per-page="-1"
      :loading="loading"
      :items="shareableLinks"
      class="elevation-5 accent"
    >
      <template #[`item.carDetails`]="{ item }">
        <router-link :to="`/cars/${item.carId}`">
          {{ item.carDetails.brand }} {{ item.carDetails.type }}
        </router-link>
      </template>
      <template #[`item.ownerName`]="{ item }">
        <OwnerChip
          :user-id="item.createdBy"
          :name="item.ownerName"
        />
      </template>
      <template #[`item.shareableLinkReference`]="{ item }">
        <router-link :to="`/share/${item.shareableLinkReference}`">
          {{ item.shareableLinkReference }}
        </router-link>
      </template>
      <template #[`item.createdAt`]="{ item }">
        {{ relativeTimeDifference(item.createdAt) }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              @click="addToClipboard(item)"
              v-on="on"
            >
              mdi-content-copy
            </v-icon>
          </template>
          <span>Link in Zwischenablage kopieren</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              @click="deleteShareableLinkModal = item"
              v-on="on"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Link löschen</span>
        </v-tooltip>
        <v-icon />
      </template>
    </v-data-table>

    <DeleteModal
      v-if="deleteShareableLinkModal"
      :subject="deleteModalSubject"
      :loading="loading"
      @submit="deleteShareableLink"
      @cancel="deleteShareableLinkModal = null"
    />
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { notificationsStore, shareableLinksStore } from '@/store'
import DeleteModal from '@/components/modals/DeleteModal.vue'
import { relativeTimeDifference } from '@/utilities/time'
import OwnerChip from '@/components/OwnerChip.vue'

@Component({ components: { Page, DeleteModal, OwnerChip }})
export default class ShareableLinksPage extends Vue {
  loading = false
  headers = [
    { text: 'Empfänger', value: 'recipientName' },
    { text: 'Fahrzeug', value: 'carDetails' },
    { text: 'Link', value: 'shareableLinkReference' },
    { text: 'Aufrufe', value: 'visitorCount' },
    { text: 'Erstellt von', value: 'ownerName' },
    { text: 'Erstellt am', value: 'createdAt' },
    { text: 'Aktionen', value: 'actions', align: 'center' }
  ]
  deleteShareableLinkModal: ShareableLinkDto | null = null

  get shareableLinks(): ShareableLinkDto[] {
    return shareableLinksStore.shareableLinks
  }

  get deleteModalSubject(): string | undefined {
    if (!this.deleteShareableLinkModal) {
      return
    }
    const car = this.deleteShareableLinkModal.carDetails 
      ? `${this.deleteShareableLinkModal.carDetails?.brand} ${this.deleteShareableLinkModal.carDetails?.type}` 
      : this.deleteShareableLinkModal.carId
    return `Link für ${this.deleteShareableLinkModal.ownerName} zu ${car}`
  }

  async mounted(): Promise<void> {
    try {
      this.loading = true
      await shareableLinksStore.fetchAllShareableLinks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Laden der geteilten Links. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  async deleteShareableLink(): Promise<void> {
    if (!this.deleteShareableLinkModal?.shareableLinkReference) return
    try {
      this.loading = true
      await shareableLinksStore.deleteShareableLink(this.deleteShareableLinkModal.shareableLinkReference)
      this.deleteShareableLinkModal = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des geteilten Links. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  async addToClipboard(item: ShareableLinkDto): Promise<void> {
    try {
      const route = this.$router.resolve(`/share/${item.shareableLinkReference}`)
      const url = new URL(route.href, window.location.origin).href;
      await navigator.clipboard.writeText(url)
      const car = item.carDetails ? `${item.carDetails?.brand} ${item.carDetails?.type}` : item.carId
      await notificationsStore.success(`Link für ${car} in die Zwischenablage kopiert.`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: "Fehler beim Generieren des Links. Bitte versuche es erneut.", err })
    }
  }

  relativeTimeDifference(createdAt: string): string {
    return relativeTimeDifference(createdAt)
  }
}
</script>
