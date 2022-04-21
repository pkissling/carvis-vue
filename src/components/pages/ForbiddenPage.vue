<template>
  <Page title="Kein Zugang">
    Leider fehlt Dir die Berechtigung, um auf diese Seite zuzugreifen.
    <br>
    Melde dich bei
    <a href="mailto:dennis@carvis.cloud?subject=Carvis Zugang">Dennis</a>, wenn
    du Zugang erhalten möchtest.
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'

@Component({ components: { Page }})
export default class Forbiddenpage extends Vue {
}
</script>
