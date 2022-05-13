<template>
  <v-row justify="center">
    <v-dialog
      :value="show"
      max-width="800"
      @input="hideModal"
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
                @change="updateRoleMap.set(role.value, $event)"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="() => hideModal()"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { notificationsStore, userManagementStore } from '@/store'

@Component
export default class EditUserModal extends Vue {
  @Prop({ required: true })
  value!: UserDto | null

  @Prop({ required: false, default: false })
  showRoles!: boolean

  @Prop({ required: false, default: () => [] })
  allRoles!: { text: string, value: Role }[]

  loading = false
  updateRoleMap: Map<Role, boolean> = new Map()
  name = ''
  company: string | null = null
  phone: string | null = null
  email: string | null = null
  roles: Role[] = []

  get show(): boolean {
    return this.value !== null
  }

  @Watch('show')
  async showChanged(show: boolean): Promise<void> {
   if (!this.value?.userId || !show) return
    this.name = this.value.name
    this.email = this.value.email || null
    this.phone = this.value.phone || null
    this.company = this.value.company || null
    this.roles = this.value.roles || []
  }

  async editUser(): Promise<void> {
    if (!this.value?.userId) return
    const userId = this.value.userId
    try {
        this.loading = true
        const { addRoles, removeRoles } = this.calculateRoles()
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
        this.hideModal()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        await notificationsStore.error({ message: 'Fehler beim Aktualisieren des Benutzers. Bitte versuche es erneut.', err })
      } finally {
        this.loading = false
      }
  }

  calculateRoles(): { addRoles: Role[], removeRoles: Role[] } {
    const addRoles: Role[] = []
    const removeRoles: Role[] = []
    this.updateRoleMap.forEach((add, role) => add ? addRoles.push(role) : removeRoles.push(role))
    return { addRoles, removeRoles }
  }

  hideModal(event?: boolean): void {
    if (event) {
      this.$emit('input', this.value)
    } else {
      this.$emit('input', null)
    }
  }
}
</script>
