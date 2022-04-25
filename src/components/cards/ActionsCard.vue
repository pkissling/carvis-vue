<template>
  <v-card class="my-12">
    <v-card-actions class="d-block d-sm-flex">
      <v-btn color="primary"
             type="submit"
             :loading="isLoading"
             :disabled="submitDisabled"
      >
        <span v-if="isNewItem"> Hinzufügen </span>
        <span v-else> Speichern </span>
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="showDelete && isNewItem"
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
  @Prop({ required: true })
  isNewItem!: boolean

  @Prop({ required: false, default: true })
  showDelete!: boolean

  @Prop({ required: false, default: false })
  submitDisabled!: boolean

  get isLoading(): boolean {
    return commonStore.isLoading
  }
}
</script>
