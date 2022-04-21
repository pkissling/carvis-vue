<template>
  <Page title="Mein Profil" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'

@Component({ components: { Page }})
export default class MyAccountPage extends Vue {
}
</script>
