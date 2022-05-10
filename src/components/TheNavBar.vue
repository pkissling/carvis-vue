<template>
  <v-navigation-drawer
    app
    clipped
    :value="value"
    @input="$emit('input', $event)"
  >
    <template v-slot:prepend>
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar-two-line"
      />
      <v-list-item
        v-else
        two-line
      >
        <v-list-item-avatar>
          <img :src="picture">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>{{ company || 'Eingeloggt' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider />

    <v-list nav>
      <v-list-item
        v-for="item in filteredItems"
        :key="item.path"
        :to="item.path"
        link
      >
        <v-list-item-icon>
          <v-badge v-if="item.badge"
                   :content="item.badge"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-badge>
          <v-icon v-else>
            {{ item.icon }}
          </v-icon>
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
import { notificationsStore, userManagementStore, userStore } from '@/store'
import { hasRole } from '@/store/modules/user-store'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TheNavBar extends Vue {
  @Prop({ required: true })
  value! :boolean

  loading = false

  get filteredItems(): ({ icon: string, text: string, path: string, badge?: number })[] {
    return this.items.filter(item => this.canAccess(item.path))
  }

  get items(): ({ icon: string, text: string, path: string, badge?: number })[] {
    return [
      { icon: 'mdi-account', text: 'Mein Profil', path: '/my-account' },
      { icon: 'mdi-account-group', text: 'Benutzerverwaltung', path: '/user-management', badge: userManagementStore.newUsersCount },
      { icon: 'mdi-car', text: 'Fahrzeuge', path: '/cars' },
      { icon: 'mdi-file-document-multiple', text: 'Gesuche', path: '/requests' }
    ]
  }

  private canAccess(path: string): boolean {
    const route = this.$router.options.routes?.find(r => r.path === path)
    if (!route) return false
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
    try {
      this.loading = true
      await userStore.fetchCarvisUser()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notificationsStore.error({ message: 'Fehler beim Laden des Benutzers. Bitte versuche es erneut.', err })
    }

    try {
      await userManagementStore.fetchNewUsersCount()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notificationsStore.error({ message: 'Fehler beim Laden der Benachrichtigungen für neue Nutzer. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
