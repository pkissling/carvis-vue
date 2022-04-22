<template>
  <Page title="Mein Profil">
    <v-form
      ref="form"
      v-model="formValid"
      @submit.stop.prevent="onSubmit"
    >
      <v-card :loading="loading"
              class="my-12"
      >
        <div class="p-12 d-flex justify-space-between">
          <v-card-title class="text-h4">
            Benutzerdaten
          </v-card-title>
        </div>
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
        </v-card-text>
      </v-card>

      <ActionsCard
        :is-new-item="false"
        :submit-disabled="!formValid"
        :show-delete="false"
      />
    </v-form>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Page from '@/components/pages/Page.vue'
import { notificationsStore, userStore } from '@/store'
import ActionsCard from '@/cards/ActionsCard.vue'

@Component({ components: { Page, ActionsCard }})
export default class MyAccountPage extends Vue {
  loading = false
  name = ''
  company: string | null = null
  formValid = false

  async mounted(): Promise<void> {
    if (!userStore.getUserId) {
      notificationsStore.error({ message: 'Fehler beim Laden des Benutzers. Bitte versuche es erneut.'})
      return
    }

    try {
      this.loading = true
      const { name, company } = await userStore.fetchCarvisUser(userStore.getUserId)
      this.name = name
      this.company = company || null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notificationsStore.error({ message: 'Fehler beim Laden des Benutzers. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  async onSubmit(): Promise<void> {
    const form = (this.$refs.form as Vue & { validate: () => boolean })
    form.validate()

    if (!userStore.getUserId) return
    this.loading = true
    try {
      await userStore.updateCarvisUser({
        userId: userStore.getUserId,
        name: this.name,
        company: this.company || undefined
      })
      notificationsStore.success('Profil erfolgreich bearbeitet.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notificationsStore.error({ message: 'Fehler beim Bearbeiten des Profils. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }
}
</script>
