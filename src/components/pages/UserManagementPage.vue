<template>
  <Page title="Benutzerverwaltung">
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="users"
    />
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { notificationsStore, userManagementStore } from '@/store'

@Component({ components: { Page }})
export default class UserManagementPage extends Vue {
  loading = false
  headers = [
    { text: 'E-Mail', value: 'email' },
    { text: 'Firma', value: 'company' },
    { text: 'Name', value: 'name' },
    { text: 'Telefon', value: 'phone' }
  ]

  get users(): UserDto[] {
    return userManagementStore.users
  }

  async mounted(): Promise<void> {
    this.loading = true
    try {
      await userManagementStore.fetchAllUsers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Laden Benutzer. Bitte versuche es erneut.`, err })
    } finally {
      this.loading = false
    }
  }

}
</script>
