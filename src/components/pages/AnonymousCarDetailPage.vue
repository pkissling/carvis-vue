<template>
  <WaitingLayer v-if="loading" />
  <Page
    v-else
    :title="title"
  >
    <CarDetailForm
      :car="car"
      :can-edit="false"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import router from '@/router'
import { Component, Vue } from 'vue-property-decorator'
import { NavigationGuardNext, Route } from 'vue-router'
import ShareableLinksApi from '@/api/shareable-links-api'
import axios from 'axios'

const shareableLinksApi = new ShareableLinksApi()

function extractReason(err: unknown): string | null {
  if (!axios.isAxiosError(err)) {
    return null
  }

  switch (err.response?.status) {
    case 410:
      return 'car-deleted'
    case 404:
      return 'link-deactivated'
    default:
      return null
  }
}

@Component({
    async beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext<AnonymousCarDetailPage>): Promise<void> {
    next(async vm => {
      vm.loading = true
      const reference = to.params.shareableLinkReference
      try {
        vm.car = await shareableLinksApi.fetchCarByShareableLinkReference(reference)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch(err: any) {
        const reason = extractReason(err)
        // this.$router is not available
        router.push({ path: '/invalid-link', query: { reason: reason }})
      } finally {
        vm.loading = false
      }
    })
  },
  components: { CarDetailForm, WaitingLayer, Page }
})
export default class AnonymousCarDetailPage extends Vue {
  car: CarDto | null = null
  loading = false

  get title(): string {
    return `${this.car?.brand || ''} ${this.car?.type || ''}`.trim()
  }
}
</script>
