<template>
  <Page title="Benutzer">
    <v-data-table
      :headers="headers"
      :items-per-page="-1"
      :loading="loading"
      :items="users"
      :sort-by.sync="sortColumn"
      :disable-sort="$vuetify.breakpoint.smAndDown"
      class="elevation-5"
    >
      <template v-for="role in allRoles"
                #[`item.${role.value}`]="{ item }"
      >
        <v-switch
          :key="role.value"
          :input-value="item.roles.includes(role.value)"
          :loading="isRoleLoading(item, role.value)"
          :disabled="isCurrentUser(item)"
          dense
          @change="updateUserRole(item, role.value, $event)"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              small
              class="mr-2"
              v-on="on"
              @click="editUserModal = item"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Benutzer bearbeiten</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              v-if="!isCurrentUser(item)"
              small
              class="mr-2"
              v-on="on"
              @click="deleteUserModal = item"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Benutzer löschen</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <DeleteModal
      v-if="deleteUserModal"
      :subject="deleteUserModal.name"
      :loading="loading"
      @submit="deleteUser"
      @cancel="deleteUserModal = null"
    />

    <EditUserModal
      v-if="editUserModal"
      :all-roles="allRoles"
      :show-roles="!isCurrentUser(editUserModal)"
      :user-id="editUserModal.userId"
      @hide="editUserModal = null"
    />
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { notificationsStore, userManagementStore, userStore } from '@/store'
import DeleteModal from '@/components/modals/DeleteModal.vue'
import EditUserModal from '@/components/modals/EditUserModal.vue'

@Component({ components: { Page, DeleteModal, EditUserModal }})
export default class UserManagementPage extends Vue {
  roleLoading: Map<Role, UserDto[]> = new Map()
  deleteUserModal: UserDto | null = null
  editUserModal: UserDto | null = null
  sortColumn = 'userId'
  allRoles: {text: string, value: Role}[] = [
    {text: 'Benutzer', value: 'user'},
    {text: 'Administrator', value: 'admin'}
  ]
  loading = false
  headers = [
    { text: 'E-Mail', value: 'email' },
    { text: 'Firma', value: 'company' },
    { text: 'Name', value: 'name' },
    { text: 'Telefon', value: 'phone' },
    ...this.allRoles,
    { text: 'Aktionen', value: 'actions' }
  ]

  get users(): UserDto[] {
    return userManagementStore.users
  }

  isCurrentUser(user?: UserDto): boolean {
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
      await userManagementStore.addUserRoles({ id: user.userId, roles: [role] })
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
      await userManagementStore.removeUserRoles({ id: user.userId, roles: [role] })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Entfernen der Rolle '${role}' für ${user.name}. Bitte versuche es erneut.`, err })
    } finally {
      this.loading = false
    }
  }

  async deleteUser(): Promise<void> {
    if (!this.deleteUserModal?.userId) return
    try {
      this.loading = true
      await userManagementStore.deleteUser(this.deleteUserModal.userId)
      this.deleteUserModal = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Benutzers. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
