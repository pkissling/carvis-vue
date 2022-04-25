<template>
  <v-menu
    v-model="isOpen"
    open-on-hover
    bottom
    flat
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        small
        label
        v-bind="attrs"
        v-on="on"
      >
        {{ name }}
      </v-chip>
    </template>
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="20"
    />
    <v-card v-else>
      <v-card-text>
        <table>
          <tr><td>Name: </td><td>{{ name }}</td></tr>
          <tr><td>Firma: </td><td>{{ company }}</td></tr>
          <tr><td>Telefon: </td><td>{{ phone }}</td></tr>
          <tr><td>E-Mail: </td><td> <a :href="`mailto:${email}`">{{ email }}</a></td></tr>
        </table>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import UsersApi from '@/api/users-api'
import { notificationsStore } from '@/store'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class OwnerChip extends Vue {

  @Prop({ required: false })
  userId!: string

  @Prop({ required: true })
  name!: string

  loading = false
  usersApi = new UsersApi()
  company = '-'
  email = '-'
  phone = '-'
  isOpen = false
  loaded = false

  @Watch('isOpen')
  async isOpenChanged(isOpen: boolean): Promise<void> {
    if (!isOpen || this.loaded || !this.userId) {
      return
    }

    try {
      this.loading = true
      const { company, email, phone } = await this.usersApi.fetchUser(this.userId)
      this.company = company || '-'
      this.email = email || '-'
      this.phone = phone || '-'
      this.loaded = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({ message: `Fehler beim Laden der Daten von Benutzer: ${this.name}. Bitte versuche es erneut.`, err })
    } finally {
      this.loading = false
    }
  }
}
</script>
