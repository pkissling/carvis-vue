<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="false"
    open-on-hover
    tile
    bottom
  >
    <template #activator="{ on, attrs }">
      <v-chip
        small
        label
        v-bind="attrs"
        v-on="on"
      >
        {{ name }}
      </v-chip>
    </template>
    <CarvisCard
      v-click-outside="isOpen = false"
      width="300"
    >
      <v-card-text>
        <v-row align="center">
          <v-col
            class="py-0"
            cols="4"
          >
            Name
          </v-col>
          <v-col
            class="py-0"
            cols="8"
          >
            <v-skeleton-loader
              v-if="loading"
              type="text"
              :tile="true"
            />
            <span v-else>
              {{ name }}
            </span>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            class="py-0"
            cols="4"
          >
            Firma
          </v-col>
          <v-col
            class="py-0"
            cols="8"
          >
            <v-skeleton-loader
              v-if="loading"
              type="text"
              :tile="true"
            />
            <span v-else>
              {{ company }}
            </span>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            class="py-0"
            cols="4"
          >
            Telefon
          </v-col>
          <v-col
            class="py-0"
            cols="8"
          >
            <v-skeleton-loader
              v-if="loading"
              type="text"
              :tile="true"
            />
            <span v-else>
              {{ phone }}
            </span>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            class="py-0"
            cols="4"
          >
            E-Mail
          </v-col>
          <v-col
            class="py-0"
            cols="8"
          >
            <v-skeleton-loader
              v-if="loading"
              type="text"
              :tile="true"
            />
            <a
              v-if="email"
              :href="`mailto:${email}`"
              target="_blank"
            >
              {{ email }}
            </a>
            <span v-else>-</span>
          </v-col>
        </v-row>
      </v-card-text>
    </CarvisCard>
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
  email: string | null = null
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
      this.email = email || null
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
