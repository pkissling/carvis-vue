<template>
  <Page title="Gesuche">
    <OverviewTable
      search-placeholder-text="Porsche Carrera"
      :search-term="searchTerm"
      :default-headers="headers"
      :items="requests"
      :loading="loading"
      @row-clicked="viewRequest"
      @create-clicked="createRequest"
      @search-term-changed="onSearchTermChanged"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/pages/Page.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { relativeTimeDifference } from '@/utilities/time'
import { commonStore, requestsStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { OverviewTable, Page } })
export default class RequestsPage extends Vue {
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
      sortable: false,
      value: 'lastChanged',
      priority: 2
    }
  ]

  get loading(): boolean {
    return this.$auth.loading || commonStore.isLoading
  }

  get requests(): RequestDto[] {
    return requestsStore.requests.map(request => {
      const lastChanged = relativeTimeDifference(request.updatedAt)
      return {
        lastChanged,
        ...request
      }
    })
  }

  get searchTerm(): string {
    return requestsStore.searchTerm
  }

  created(): void {
    requestsStore.fetchAllRequests().catch(err =>
      notificationsStore.error({
        message: 'Fehler beim Laden der Gesuche. Bitte versuche es erneut.',
        err
      })
    )
  }

  viewRequest(request: RequestDto): void {
    this.$router.push({ path: `/requests/${request.id}` })
  }

  createRequest(): void {
    this.$router.push({ path: '/requests/add' })
  }

  onSearchTermChanged(searchTerm: string): void {
    requestsStore.setSearchTerm(searchTerm)
  }
}
</script>
