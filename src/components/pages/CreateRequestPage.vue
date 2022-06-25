<template>
  <Page title="Gesuch hinzufügen">
    <RequestDetailForm
      :request="request"
      :save-request-function="createRequest"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import { requestsStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { RequestDetailForm, Page }})
export default class CreateRequestPage extends Vue {
    request = { contactDetails: {} } as RequestDto

    async createRequest(request: RequestDto): Promise<void> {
      try {
        await requestsStore.createRequest(request)
        await this.$router.push({ path: '/requests' })
        await notificationsStore.success('Gesuch erfolgreich erstellt.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch(err: any) {
        await notificationsStore.error({ message: 'Fehler beim Erstellen des Gesuches. Bitte versuche es erneut.', err })
    }
  }
}
</script>
