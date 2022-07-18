<template>
  <CarvisModal>
    <template slot="title-text">
      {{ name }} wirklich löschen?
    </template>
    <template slot="primary-button">
      <v-btn
        color="error"
        :loading="loading"
        @click="deleteUser"
      >
        Löschen
      </v-btn>
    </template>
  </CarvisModal>
</template>

<script lang="ts">
import { modalsStore, notificationsStore, userManagementStore } from '@/store'
import CarvisModal from '@/components/modals/CarvisModal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { CarvisModal }})
export default class DeleteUserModal extends Vue {
  @Prop({ required: true })
  context!: UserDto

  dialog = true
  loading = false


  get name(): string {
    return this.context.name
  }

  async deleteUser(): Promise<void> {
    if (!this.context.userId) return
    try {
      this.loading = true
      await userManagementStore.deleteUser(this.context.userId)
      await notificationsStore.success('Benutzer erfolgreich gelöscht.')
      await modalsStore.close()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: 'Fehler beim Löschen des Benutzers. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
