<template>
  <CarvisModal>
    <template slot="title">
      Benutzer bearbeiten
    </template>
    <template slot="default">
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
        <v-col
          v-for="role in allRoles"
          :key="role.value"
        >
          <v-switch
            :input-value="roles.includes(role.value)"
            :label="role.text"
            @change="updateRoleMap.set(role.value, $event)"
          />
        </v-col>
      </v-row>
    </template>
    <template slot="primary-button">
      <v-btn
        color="primary"
        type="submit"
        :disabled="!name"
        :loading="loading"
        @click="editUser"
      >
        Speichern
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { modalsStore, notificationsStore, userManagementStore, userStore } from '@/store'
import CarvisModal from '@/components/modals/CarvisModal.vue'

@Component({ components: { CarvisModal }})
export default class EditUserModal extends Vue {
  @Prop({ required: true })
  context!: UserDto

  loading = false
  updateRoleMap: Map<Role, boolean> = new Map()
  name = ''
  company: string | null = null
  phone: string | null = null
  email: string | null = null
  roles: Role[] = []
  allRoles: { text: string, value: Role }[] = [
    {text: 'Benutzer', value: 'user' },
    {text: 'Administrator', value: 'admin' }
  ]

  get showRoles(): boolean {
    return this.context?.userId === userStore.getUserId
  }

  mounted(): void {
    this.name = this.context.name
    this.email = this.context.email || null
    this.phone = this.context.phone || null
    this.company = this.context.company || null
    this.roles = this.context.roles || []
  }

  async editUser(): Promise<void> {
    if (!this.context?.userId) return
    const userId = this.context.userId
    try {
        this.loading = true
        const { addRoles, removeRoles } = this.rolesToChange
        await userManagementStore.updateUser({
          user: {
            userId: userId,
            name: this.name,
            email: this.email || undefined,
            company: this.company || undefined,
            phone: this.phone || undefined
          }, addRoles, removeRoles
        })
        await notificationsStore.success('Profil erfolgreich bearbeitet.')
        await modalsStore.close()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        await notificationsStore.error({ message: 'Fehler beim Aktualisieren des Benutzers. Bitte versuche es erneut.', err })
      } finally {
        this.loading = false
      }
  }

  get rolesToChange(): { addRoles: Role[], removeRoles: Role[] } {
    const addRoles: Role[] = []
    const removeRoles: Role[] = []
    this.updateRoleMap.forEach((add, role) => add ? addRoles.push(role) : removeRoles.push(role))
    return { addRoles, removeRoles }
  }
}
</script>