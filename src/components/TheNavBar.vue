<template>
  <v-navigation-drawer
    app
    clipped
    :value="value"
    @input="$emit('input', $event)"
  >
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img :src="picture">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>Eingeloggt</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider />

    <v-list>
      <v-list-item
        v-for="([icon, text, route], i) in items"
        :key="i"
        :to="route"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          dark
          block
          elevation="2"
          :loading="$auth.loading"
          color="accent"
          @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { userStore } from '@/store'
export default {
  props: {
    value: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      items: [
        ['mdi-car', 'Fahrzeuge', '/cars'],
        ['mdi-file-document-multiple', 'Gesuche', '/requests']
      ]
    }
  },
  computed: {
    name() {
      return userStore.getName
    },
    picture() {
      return userStore.getPicture
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
