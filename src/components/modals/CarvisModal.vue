<template>
  <v-row justify="center">
    <v-dialog
      :value="true"
      max-width="800"
      @input="closeModal"
    >
      <CarvisCard
        :loading="loading"
      >
        <v-card-title class="headline">
          <slot name="title-text">
            Dummy title
          </slot>
        </v-card-title>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="closeModal"
          >
            <slot name="cancel-button-text">
              Abbrechen
            </slot>
          </v-btn>
          <slot name="primary-button">
            <v-btn
              color="primary"
            >
              <slot name="primary-button-text">
                Löschen
              </slot>
            </v-btn>
          </slot>
        </v-card-actions>
      </CarvisCard>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { modalsStore } from '@/store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class CarvisModal extends Vue {
  @Prop({ required: false, default: false })
  loading!: boolean

  async closeModal(): Promise<void> {
    await modalsStore.close()
  }
}
</script>