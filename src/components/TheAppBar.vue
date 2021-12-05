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

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: null
    },
  },
  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },
  watch: {
    isMobile(isMobile) {
      if (isMobile) {
        // show navbar
        this.$emit('input', true)
      }
    }
  }
}
</script>
