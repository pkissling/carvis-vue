<template>
  <v-app-bar
    color="secondary"
    app
    clipped-left
  >
    <v-app-bar-nav-icon
      :value="value"
      @click="$emit('input', !value)"
    />

    <v-spacer />

    <router-link to="/">
      <v-img
        alt="Carvis"
        class="shrink"
        contain
        src="@/assets/images/logo_250px.png"
        transition="scale-transition"
        width="100"
      />
    </router-link>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TheAppBar extends Vue {
  @Prop({ required: true})
  value!: boolean
}
</script>
