<template>
  <CarvisCard class="my-12">
    <v-card-actions class="d-block d-sm-flex">
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="submitDisabled"
      >
        <span v-if="isNewItem">
          Hinzufügen
        </span>
        <span v-else>
          Speichern
        </span>
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="showDelete && !isNewItem"
        color="error"
        text
        @click="$emit('delete')"
      >
        Löschen
      </v-btn>
    </v-card-actions>
  </CarvisCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ActionsCard extends Vue {
  @Prop({ required: true })
  isNewItem!: boolean

  @Prop({ required: true })
  showDelete!: boolean

  @Prop({ required: false, default: false })
  submitDisabled!: boolean

  @Prop({ required: false, default: false })
  loading!: boolean

}
</script>
