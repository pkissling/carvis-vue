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
          <v-list-item-subtitle>{{ company }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider />

    <v-list nav>
      <v-list-item
        to="/my-account"
        link
      >
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Mein Profil</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item
        v-for="item in filteredItems"
        :key="item.route"
        :to="item.route"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
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
          @click="$auth.logout()"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { commonStore, notificationsStore, userStore } from '@/store'
import { hasRole } from '@/store/modules/user-store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'

@Component
export default class TheNavBar extends Vue {
  @Prop({ required: true })
  value! :boolean

  items = [
    { icon: 'mdi-car', text: 'Fahrzeuge', route: '/cars' },
    { icon: 'mdi-file-document-multiple', text: 'Gesuche', route: '/requests' },
  ]

  get filteredItems(): ({ icon: string, text: string, route: string })[] {
    const declaredRoutes = this.items.map(item => item.route)
    return this.$router.options.routes
      ?.filter(route => declaredRoutes.includes(route.path))
      .filter(route => this.canAccess(route))
      .map(route => this.items.find(r => r.route === route.path)) as ({ icon: string, text: string, route: string })[]
  }

  private canAccess(route: RouteConfig): boolean {
    return hasRole(this.$auth.user || null, route.meta?.requiresRole)
  }

  get name(): string | undefined {
    return userStore.getName
  }

  get picture(): string | undefined {
    return userStore.getPicture
  }

  get company(): string | undefined {
    return userStore.getCompany
  }

  async mounted(): Promise<void> {
    commonStore.setLoading(true)
    if (!userStore.getUserId) return
    try {
      await userStore.fetchCarvisUser(userStore.getUserId)
    } catch (err: any) {
      notificationsStore.error({
        message: 'Fehler beim Laden des Benutzers. Bitte versuche es erneut.',
        err
      })
    } finally {
      commonStore.setLoading(false)
    }
  }
}
</script>
