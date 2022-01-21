<template>
  <v-row
    v-if="subject"
    justify="center"
  >
    <v-dialog
      v-model="dialog"
      max-width="400"
      @input="$emit('cancel')"
    >
      <v-card>
        <v-card-title class="headline">
          {{ subject }} wirklich löschen?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="$emit('cancel')"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="error"
            text
            :loading="isLoading"
            @click="$emit('submit')"
          >
            Löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { commonStore } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DeleteModal extends Vue {

  @Prop({ required: true, default: 'asdas' })
  subject!: string

  dialog = true

  get isLoading() : boolean {
    return commonStore.isLoading
  }
}
</script>