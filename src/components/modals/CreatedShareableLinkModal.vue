<template>
  <CarvisModal>
    <template slot="title-text">
      Teilbarer Link erfolgreich erstellt
    </template>
    <template slot="default">
      <p class="mt-6">
        Den nachfolgenden Link kannst du nun mit Kunden teilen - auch wenn diese keinen Carvis-Account besitzen.
      </p>
      <v-text-field
        append-outer-icon="mdi-content-type"
        readonly
        hide-details
        :value="shareableLinkUrl"
      >
        <template #append-outer>
          <v-icon
            class="mr-2"
            @click="addToClipboard"
          >
            mdi-content-copy
          </v-icon>
        </template>
      </v-text-field>
      <p class="mt-6">
        <a @click="toShareableLinkOverview">Hier</a>
        findest du eine Übersicht aller teilbaren Links.
      </p>
    </template>
    <template slot="primary-button">
      <v-btn
        color="primary"
        @click="closeModal"
      >
        Schließen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { modalsStore, notificationsStore } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { CarvisModal }})
export default class CreatedShareableLinkModal extends Vue {
  @Prop({ required: true })
  context!: ShareableLinkDto

  loading = false
  recipientName: string | null = null
  recipientNames: string [] = []

  async closeModal(): Promise<void> {
    await modalsStore.close()
  }

  get shareableLinkUrl(): string | null {
    if (!this.context) {
      return null
    }

    const route = this.$router.resolve(`/share/${this.context.shareableLinkReference}`)
    return new URL(route.href, window.location.origin).href
  }


   async addToClipboard(): Promise<void> {
    if (!this.shareableLinkUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(this.shareableLinkUrl)
      const car = this.context.carDetails ? `${this.context.carDetails?.brand} ${this.context.carDetails?.type}` : this.context.carId
      await notificationsStore.success(`Link für ${car} in die Zwischenablage kopiert.`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: "Fehler beim Kopieren des Links in die Zwischenablage. Bitte versuche es erneut.", err })
    }
  }

  async toShareableLinkOverview(): Promise<void> {
    await this.closeModal()
    await this.$router.push('/shareable-links')
  }
}
</script>
