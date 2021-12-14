<template>
  <div>
    <v-text-field
      v-model="searchTerm"
      :placeholder="searchPlaceholderText"
      prepend-icon="mdi-magnify"
      class="mt-12 mb-4"
      outlined
      clearable
    />

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :items-per-page="20"
      :loading="loading"
      :mobile-breakpoint="0"
      :sort-by.sync="sortColumn"
      :sort-desc.sync="descending"
      class="elevation-5"
      @click:row="onRowClicked"
    >
      <template #[`item.preview`]="{ item }">
        <slot :proxiedProps="item" />
      </template>
    </v-data-table>

    <FloatingButton
      :loading="loading"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import FloatingButton from '@/components/FloatingButton'

export default {
  components: {
    FloatingButton,
  },
  props: {
    searchPlaceholderText: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      loading: false
    }
  },
  data() {
    return {
      searchTerm: '',
      sortColumn: 'updatedAt',
      descending: true
    }
  },
  computed: {
    filteredItems () {
      if (!this.searchTerm?.trim()) {
        return this.items
      }

      const searchTerms = this.searchTerm
        .split(' ')
        .map(term => term.toLowerCase())

      return this.items.filter(item => {
        const attributes = this.extractAllAttributes(item)
        return searchTerms.every(term => attributes.some(a => a.includes(term)))
      })
    }
  },
  methods: {
    onRowClicked(car) {
      this.$emit('row-clicked', car)
    },
    extractAllAttributes(item) {
      if (item === null || !Object.keys(item).length) return null
      return Object.values(item)
        .map(v => typeof v == "object" ? this.extractAllAttributes(v) : v)
        .filter(v => v)
        .map(v => v.toString().toLowerCase())
    }
  }
}
</script>