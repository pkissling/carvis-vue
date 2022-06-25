<template>
  <v-card
    :class="{ accent: isDarkTheme }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot
      v-for="slot in Object.keys($slots)"
      :slot="slot"
      :name="slot"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CarvisCard extends Vue {

  get isDarkTheme(): boolean {
    return this.$vuetify.theme.dark
  }
}
</script>