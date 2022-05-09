<template>
  <v-row justify="center">
    <v-dialog v-model="dialog"
              max-width="800"
              @input="$emit('cancel')"
    >
      <v-card :loading="loading">
        <v-card-title class="headline">
          Benutzer bearbeiten
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="name"
                :rules="[v => !!v || 'Pflichtfeld']"
                required
                label="Name"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="company"
                label="Firma"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="phone"
                label="Telefon"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="email"
                label="E-Mail"
                hint="Die E-Mail-Adresse kann nicht geändert werden."
                persistent-hint
                required
                disabled
              />
            </v-col>
          </v-row>
          <v-row v-if="showRoles">
            <v-col v-for="role in allRoles"
                   :key="role.value"
            >
              <v-switch
                :input-value="roles.includes(role.value)"
                :label="role.text"
                :loading="roleLoading.includes(role.value)"
                @change="updateUserRole(role.value, $event)"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text
                 @click="$emit('hide')"
          >
            Abbrechen
          </v-btn>
          <v-btn color="primary"
                 type="submit"
                 :loading="loading"
                 @click="editUser"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UsersApi from '@/api/users-api'
import { notificationsStore, userManagementStore } from '@/store'


const usersApi = new UsersApi()

@Component
export default class EditUserModal extends Vue {
  @Prop({ required: true })
  userId!: string

  @Prop({ required: false, default: false })
  showRoles!: boolean

  @Prop({ required: false, default: () => [] })
  allRoles!: { text: string, value: Role }[]

  dialog = true
  loading = false
  roleLoading: Role[] = []
  name = ''
  company: string | null = null
  phone: string | null = null
  email: string | null = null
  roles: Role[] = []

 async mounted(): Promise<void> {
    try {
      this.loading = true
      this.roleLoading = this.allRoles.map(role => role.value)
      const { name, company, phone, email, roles } = await usersApi.fetchUser(this.userId)
      this.name = name
      this.email = email || null
      this.phone = phone || null
      this.company = company || null
      this.roles = roles || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notificationsStore.error({ message: 'Fehler beim Laden des Benutzers. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
      this.roleLoading = []
    }
  }

  async editUser(): Promise<void> {
    try {
        this.loading = true
        await userManagementStore.updateUser({
          userId: this.userId,
          name: this.name,
          email: this.email || undefined,
          company: this.company || undefined,
          phone: this.phone || undefined
        })
        this.$emit('hide')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        await notificationsStore.error({ message: 'Fehler beim Aktualisieren des Benutzers. Bitte versuche es erneut.', err })
      } finally {
        this.loading = false
      }
  }

  async updateUserRole(role: Role, add: boolean): Promise<void> {
    try {
      this.roleLoading.push(role)
      const action = add
        ? userManagementStore.addUserRoles({ id: this.userId, roles: [role] })
        : userManagementStore.removeUserRoles({ id: this.userId, roles: [role] })
      await action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Aktualisieren der Rolle '${role}' des Benutzers. Bitte versuche es erneut.`, err })
    } finally {
      const index = this.roleLoading.indexOf(role)
      if (index !== -1) {
        this.roleLoading.splice(this.roleLoading.indexOf(role), 1)
      }
    }
  }
}
</script>
