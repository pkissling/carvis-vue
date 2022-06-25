<template>
  <CarvisCard
    :loading="loading"
    class="my-12"
  >
    <div class="p-12 d-flex justify-space-between">
      <v-card-title class="text-h4">
        Fahrzeugbilder
      </v-card-title>
      <v-switch
        v-if="canEdit"
        v-model="editMode"
        label="Bearbeiten"
        large
        class="my-auto mx-4"
      />
    </div>
    <v-card-text>
      <EditCarImages
        v-if="editMode"
        :image-ids="value"
        @change="onImagesChange"
        @loading="onLoading"
      />
      <ViewCarImages
        v-else
        :image-ids="value"
        :loading="loading"
        @loading="onLoading"
      />
    </v-card-text>
  </CarvisCard>
</template>
<script lang="ts">
import ViewCarImages from '@/components/ViewCarImages.vue'
import EditCarImages from '@/components/EditCarImages.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ components: { ViewCarImages, EditCarImages }})
export default class CarPreviewCard extends Vue {

  @Prop({ required: true })
  startInEditMode!: boolean

  @Prop({ required: true })
  canEdit!: boolean

  @Prop({ required: false, default: () => [] })
  value!: string[]

  imageIds = []
  loading = false
  editMode = false

  created(): void {
    this.editMode = this.startInEditMode
  }
  onImagesChange(imageIds: string[]): void {
    this.$emit('input', imageIds)
  }

  onLoading(value: boolean): void {
      this.loading = value
  }
}
</script>
