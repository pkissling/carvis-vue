<template>
  <Page title="Gesuche">
    <OverviewTable
      search-placeholder-text="Porsche Carrera"
      :search-term="searchTerm"
      :default-headers="headers"
      :items="requests"
      :loading="loading"
      @row-clicked="viewRequest"
      @search-term-changed="onSearchTermChanged"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { requestsStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { OverviewTable, Page } })
export default class RequestsPage extends Vue {

  loading = false
  headers: HighlightableDataTableHeader[] = [
    {
      value: 'brand',
      priority: 0
    },
    {
      value: 'type',
      priority: 0
    },
    {
      value: 'bodyType',
      priority: 0
    },
    {
      value: 'modelYear',
      priority: 0
    },
    {
      value: 'ownerName',
      priority: 2
    },
    {
      value: 'updatedAt',
      priority: 2
    }
  ]

  get requests(): RequestDto[] {
    return requestsStore.requests
  }

  get searchTerm(): string {
    return requestsStore.searchTerm
  }

  async created(): Promise<void> {
    try {
      this.loading = true
      await requestsStore.fetchAllRequests()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({message: 'Fehler beim Laden der Gesuche. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  viewRequest(request: RequestDto): void {
    this.$router.push({ path: `/requests/${request.id}` })
  }

  onSearchTermChanged(searchTerm: string): void {
    requestsStore.setSearchTerm(searchTerm)
  }
}
</script>
