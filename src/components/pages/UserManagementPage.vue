<template>
  <Page title="Benutzer">
    <v-data-table
      :headers="headers"
      :items-per-page="-1"
      :loading="loading"
      :items="users"
      sort-by="name"
      :disable-sort="$vuetify.breakpoint.smAndDown"
      class="elevation-5 accent"
    >
      <template #[`item.picture`]="{ item }">
        <v-badge
          v-if="item.isNewUser"
          overlap
        >
          <v-avatar
            v-if="item.picture"
            tile
          >
            <img :src="item.picture">
          </v-avatar>
        </v-badge>
        <v-avatar
          v-else
          tile
        >
          <img
            v-if="item.picture"
            :src="item.picture"
          >
        </v-avatar>
      </template>
      <template
        v-for="role in allRoles"
        #[`item.${role.value}`]="{ item }"
      >
        <v-switch
          :key="role.value"
          :input-value="item.roles.includes(role.value)"
          :loading="isRoleLoading(item, role.value)"
          :disabled="isCurrentUser(item) || isRoleLoading(item, role.value)"
          dense
          @change="updateUserRole(item, role.value, $event)"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              :disabled="isCurrentUser(item)"
              @click="openEditUserModal(item)"
              v-on="on"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Benutzer bearbeiten</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              :disabled="isCurrentUser(item)"
              @click="openDeleteUserModal(item)"
              v-on="on"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Benutzer löschen</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { modalsStore, notificationsStore, userManagementStore, userStore } from '@/store'

@Component({ components: { Page }})
export default class UserManagementPage extends Vue {
  roleLoading: Map<Role, UserDto[]> = new Map()
  allRoles: { text: string, value: Role }[] = [
    {text: 'Benutzer', value: 'user' },
    {text: 'Administrator', value: 'admin' }
  ]
  loading = false
  headers = [
    { value: 'picture' },
    { text: 'Name', value: 'name' },
    { text: 'Firma', value: 'company' },
    { text: 'E-Mail', value: 'email' },
    { text: 'Telefon', value: 'phone' },
    ...this.allRoles,
    { text: 'Aktionen', value: 'actions', align: 'center' }
  ]

  get users(): UserDto[] {
    return userManagementStore.users
  }

  isCurrentUser(user: UserDto | null): boolean {
    return user?.userId === userStore.getUserId
  }

  isRoleLoading(user: UserDto, role: Role): boolean {
    return this.roleLoading.get(role)?.includes(user) || false
  }

  async mounted(): Promise<void> {
    try {
      this.loading = true
      await userManagementStore.fetchAllUsers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Laden der Benutzer. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  async updateUserRole(user: UserDto, role: Role, add: boolean): Promise<void> {
    try {
      this.roleLoading.get(role)?.push(user) || this.roleLoading.set(role, [user])
      if (add) {
        await this.addUserRole(user, role)
      } else {
        await this.removeUserRole(user, role)
      }
    } finally {
      const index = this.roleLoading.get(role)?.indexOf(user) || -1
      if (index !== -1) {
        this.roleLoading.get(role)?.splice(index, 1)
      }
    }
  }

  async addUserRole(user: UserDto, role: Role): Promise<void> {
     try {
      this.loading = true
      await userManagementStore.addUserRoles({ userId: user.userId, roles: [role] })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Hinzufügen der Rolle '${role}' für ${user.name}. Bitte versuche es erneut.`, err })
    } finally {
      this.loading = false
    }
  }

  async removeUserRole(user: UserDto, role: Role): Promise<void> {
    try {
      this.loading = true
      await userManagementStore.removeUserRoles({ userId: user.userId, roles: [role] })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Entfernen der Rolle '${role}' für ${user.name}. Bitte versuche es erneut.`, err })
    } finally {
      this.loading = false
    }
  }

  async openDeleteUserModal(user: UserDto): Promise<void> {
    await modalsStore.open({ name: 'DeleteUserModal', context: user })
  }

  async openEditUserModal(user: UserDto): Promise<void> {
    await modalsStore.open({ name: 'EditUserModal', context: user })
  }
}
</script>
