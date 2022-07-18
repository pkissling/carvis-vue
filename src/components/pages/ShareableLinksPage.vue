<template>
  <Page title="Geteilte Links">
    <v-data-table
      :headers="headers"
      :items-per-page="-1"
      :loading="loading"
      :items="shareableLinks"
      sort-by="createdAt"
      sort-desc
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
              @click="openDeleteShareableLinkModal(item)"
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
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { modalsStore, notificationsStore, shareableLinksStore } from '@/store'
import { relativeTimeDifference } from '@/utilities/time'
import OwnerChip from '@/components/OwnerChip.vue'

@Component({ components: { Page, OwnerChip }})
export default class ShareableLinksPage extends Vue {
  loading = false
  headers = [
    { text: 'Empfänger', value: 'recipientName' },
    { text: 'Fahrzeug', value: 'carDetails' },
    { text: 'Link', value: 'shareableLinkReference' },
    { text: 'Aufrufe', value: 'visitorCount' },
    { text: 'Erstellt von', value: 'ownerName' },
    { text: 'Erstellt am', value: 'createdAt' },
    { text: 'Aktionen', value: 'actions', align: 'center', sortable: false}
  ]

  get shareableLinks(): ShareableLinkDto[] {
    return shareableLinksStore.shareableLinks
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

  async addToClipboard(item: ShareableLinkDto): Promise<void> {
    try {
      const route = this.$router.resolve(`/share/${item.shareableLinkReference}`)
      const url = new URL(route.href, window.location.origin).href
      await navigator.clipboard.writeText(url)
      const car = item.carDetails ? `${item.carDetails?.brand} ${item.carDetails?.type}` : item.carId
      await notificationsStore.success(`Link für ${car} in die Zwischenablage kopiert.`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: "Fehler beim Kopieren des Links in die Zwischenablage. Bitte versuche es erneut.", err })
    }
  }

  async openDeleteShareableLinkModal(link: ShareableLinkDto): Promise<void> {
    await modalsStore.open({ name: 'DeleteShareableLinkModal', context: link })
  }

  relativeTimeDifference(createdAt: string): string {
    return relativeTimeDifference(createdAt)
  }
}
</script>
