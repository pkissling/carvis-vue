<template>
  <v-row
    v-if="subject"
    justify="center"
  >
    <v-dialog
      v-model="dialog"
      max-width="800"
      @input="$emit('cancel')"
    >
      <CarvisCard>
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
            :loading="loading"
            @click="$emit('submit')"
          >
            Löschen
          </v-btn>
        </v-card-actions>
      </CarvisCard>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DeleteModal extends Vue {
  @Prop({ required: true })
  subject!: string

  @Prop({ required: false, default: false })
  loading!: boolean

  dialog = true

}
</script>
