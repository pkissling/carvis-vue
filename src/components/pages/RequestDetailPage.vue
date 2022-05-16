<template>
  <WaitingLayer v-if="loading" />
  <Page v-else
        :title="title"
  >
    <RequestDetailForm :request="request"
                       @submit="updateRequest"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import RequestDetailForm from '@/components/RequestDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import router from '@/router'
import { requestsStore, notificationsStore } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { NavigationGuardNext, Route } from 'vue-router'

@Component({
  async beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext<RequestDetailPage>): Promise<void> {
    next(async vm => {
      vm.loading = true
      const requestId = to.params.requestId
      try {
        vm.request = await requestsStore.fetchRequest(requestId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch(err: any) {
        notificationsStore.error({
          message: 'Fehler beim Laden des Gesuchs. Bitte versuche es erneut.',
          err
        })
        // this.$router is not available
        router.push({ name: 'NotFound' })
      } finally {
        vm.loading = false
      }
    })
  },
  components: { RequestDetailForm, WaitingLayer, Page }
})
export default class RequestDetailPage extends Vue {
  @Prop({ required: true })
  requestId!: string

  loading = false
  request: RequestDto | null = null

  get title(): string {
    return `${this.request?.brand} ${this.request?.type || ''}`
  }

  async updateRequest(request: RequestDto): Promise<void> {
    try {
      await requestsStore.updateRequest(request)
      await this.$router.push({ path: '/requests' })
      await notificationsStore.success('Gesuch erfolgreich bearbeitet.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({
        message: 'Fehler beim Bearbeiten des Gesuchs. Bitte versuche es erneut.',
        err
      })
    }
  }
}
</script>
