<template>
  <Page title="Seite nicht gefunden" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'

@Component({ components: { Page }})
export default class NotFoundPage extends Vue {
}
</script>
