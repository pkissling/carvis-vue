/* eslint-disable vue/no-v-html */
<template>
  <div>
    <v-text-field
      :value="searchTerm"
      :placeholder="searchPlaceholderText"
      prepend-icon="mdi-magnify"
      class="mt-12 mb-4"
      outlined
      clearable
      @input="$emit('search-term-changed', $event)"
    />

    <v-data-table
      :headers="filteredHeaders"
      :items="filteredItems"
      :items-per-page="-1"
      :loading="loading"
      :mobile-breakpoint="0"
      :sort-by.sync="sortColumn"
      :sort-desc.sync="descending"
      class="elevation-5"
      @click:row="onRowClicked"
    >
      <template
        v-for="header in filteredHeaders"
        v-slot:[`item.${header.value}`]="{ item }"
      >
        <slot
          :name="header.value"
          :item="item"
        >
          <span
            :key="header.value"
            v-html="highlightSearchTerm(item[header.value])"
          />
        </slot>
      </template>
      <template #[`item.previewImageId`]="{ item }">
        <CarThumbnail :image-id="item.previewImageId" />
      </template>
      <template #[`item.ownerName`]="{ item }">
        <OwnerChip
          :user-id="item.createdBy"
          :name="item.ownerName"
        />
      </template>
    </v-data-table>

    <FloatingButton :loading="loading"
                    v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import FloatingButton from '@/components/FloatingButton.vue';
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mappedAttributes } from '@/utilities/mapping'
import CarThumbnail from '@/components/CarThumbnail.vue'
import OwnerChip from '@/components/OwnerChip.vue'

@Component({ components: { FloatingButton, CarThumbnail, OwnerChip} })
export default class OverviewTable<T> extends Vue {

  @Prop({ required: true })
  searchPlaceholderText!: string

  @Prop({ required: true })
  defaultHeaders!: HighlightableDataTableHeader[]

  @Prop({ required: true })
  items!: T[]

  @Prop({ required: false, default: false })
  loading!: boolean

  @Prop({ required: true })
  searchTerm!: string | null

  sortColumn = 'updatedAt'
  descending = true

  get searchTerms(): string[] {
    return this.searchTerm
      ?.trim()
      .split(' ')
      .filter(s => s.length > 0)
      .map(s => s.trim()) || []
  }

  get filteredItems(): T[] {
    if (!this.searchTerm?.trim()) {
      return this.items
    }

    return this.items
      .filter(item => {
        const attributes = this.extractAllAttributes(item)
        return this.searchTerms
          .map(term => term.toLowerCase())
          .every(term => attributes.some(a => a.value.includes(term)))
      })
  }

  get filteredHeaders(): HighlightableDataTableHeader[] {
    if (!this.searchTerm?.trim()) {
      return this.headers
    }

    const searchTerms = this.searchTerms
      .map(term => term.toLowerCase())

    const headersWithMatches: HighlightableDataTableHeader[] = this.items
      .flatMap(item => this.extractAllAttributes(item))
      .filter(attribute => searchTerms.some(term => attribute.value.includes(term)))
      .filter(attribute => !this.headers.some(header => header.value === attribute.key))
      .map(attribute => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          text: mappedAttributes.get(attribute.key)!,
          value: attribute.key,
          sortable: true,
          priority: 1,
      }})

    return [...headersWithMatches, ...this.headers]
      .sort((a, b) => a.priority - b.priority)
      // unique by value
      .filter((attr, index, self) => index === self.findIndex(a => (a.value === attr.value)))
  }

  get headers() : HighlightableDataTableHeader[] {
    return this.defaultHeaders
      .filter(header => header.forceShow || mappedAttributes.has(header.value))
      .map(header => {
        return { ...header, text: mappedAttributes.get(header.value) || '' }
      })
  }

  onRowClicked(car: CarDto): void {
    this.$emit('row-clicked', car)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractAllAttributes(item: Record<string, any>, path: string | null = null): Record<string, string>[] {
    // TODO ads
    if (item === null || !Object.keys(item).length) return []
    return Object.keys(item)
      .filter(key => mappedAttributes.has(key))
      .map(key => path ? `${path}.${key}` : key)
      .map(key => { return { key, value: item[key] }})
      .flatMap(({ key, value }) => {
        if (value && typeof value === 'object') {
          return this.extractAllAttributes(value, key)
        }
        return { key, value }})
      .filter(({ value }) => value !== null && value !== undefined)
      .map(({ key, value }) => { return { key, value: String(value).toLowerCase() }})
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlightSearchTerm(value: any): string {
    if (!value) return value
    const stringValue = new String(value)
    const match = this.searchTerms.find(term => stringValue.match(new RegExp(term, 'i')))
    if (!match) {
      return value
    }
    return stringValue.replace(new RegExp(match, 'gi'), '<mark>$&</mark>')
  }
}
</script>
