<template>
  <CarvisModal>
    <template slot="title-text">
      Fahrzeug teilen
    </template>
    <template
      slot="default"
    >
      Bitte gib den Name des Empfängers an
      <v-combobox
        v-model="recipientName"
        label="Empfänger"
        :loading="comboboxLoading"
        :items="recipientNames"
        hide-selected
      />
    </template>
    <template slot="primary-button">
      <v-btn
        color="primary"
        :loading="loading || comboboxLoading"
        :disabled="!recipientName"
        @click="generateLink"
      >
        Link erstellen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import AdminShareableLinksApi from '@/api/admin-shareable-links-api'
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { modalsStore, notificationsStore, shareableLinksStore } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

const adminShareableLinksApi = new AdminShareableLinksApi()

@Component({ components: { CarvisModal }})
export default class CreateShareableLinkModal extends Vue {
  @Prop({ required: true })
  context!: string

  loading = false
  comboboxLoading = false
  recipientName: string | null = null
  recipientNames: string[] = []

  async mounted(): Promise<void> {
    try {
      this.comboboxLoading = true
      this.recipientNames = shareableLinksStore.shareableLinks
        .map(link => link.recipientName)
        .filter((x, i, a) => a.indexOf(x) == i) // unique
      const links = await shareableLinksStore.fetchAllShareableLinks()
      this.recipientNames =  links.map(link => link.recipientName)
        .filter((x, i, a) => a.indexOf(x) == i) // unique
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Laden der geteilten Links. Bitte versuche es erneut.', err })
    } finally {
      this.comboboxLoading = false
    }
  }
  async generateLink(): Promise<void> {
    if (!this.recipientName || !this.context) {
      return
    }

    try {
      this.loading = true
      const shareableLinkDto = await adminShareableLinksApi.generateShareableLink(this.context, this.recipientName)
      await notificationsStore.success('Teilbarer link erfolgreich erstellt.')
      await modalsStore.open({ name: 'CreatedShareableLinkModal', context: shareableLinkDto })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Generieren des geteilten Links. Bitte versuche es erneut.', err })
      } finally {
      this.loading = false
    }
  }
}
</script>
