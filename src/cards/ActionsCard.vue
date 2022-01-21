<template>
  <v-card class="my-12">
    <v-card-actions class="d-block d-sm-flex">
      <v-btn
        color="primary"
        type="submit"
        :loading="isLoading"
      >
        <span v-if="id">
          Speichern
        </span>
        <span v-else>
          Hinzufügen
        </span>
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="id"
        color="error"
        text
        :loading="isLoading"
        @click="$emit('delete')"
      >
        Löschen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { commonStore } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ActionsCard extends Vue {

  @Prop()
  id!: string

  get isLoading() : boolean {
    return commonStore.isLoading
  }
}
</script>